import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, MapPin, Star, Navigation, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  avg_rating?: number;
  review_count?: number;
  products?: { name: string; price_min: number; price_max: number }[];
  distance?: number;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data: bizData } = await supabase
      .from("businesses")
      .select("*")
      .eq("is_active", true);

    if (!bizData) { setLoading(false); return; }

    const { data: productsData } = await supabase
      .from("business_products")
      .select("business_id, name, price_min, price_max")
      .eq("is_available", true);

    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("business_id, rating");

    const enriched: Business[] = bizData.map((b) => {
      const prods = productsData?.filter((p) => p.business_id === b.id) || [];
      const revs = reviewsData?.filter((r) => r.business_id === b.id) || [];
      const avg = revs.length > 0 ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 0;
      return {
        ...b,
        products: prods,
        avg_rating: avg,
        review_count: revs.length,
      } as Business;
    });

    setBusinesses(enriched);
    setLoading(false);
  };

  const detectLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      }
    );
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const filtered = businesses
    .map((b) => ({
      ...b,
      distance: userLocation && b.latitude && b.longitude
        ? getDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
        : undefined,
    }))
    .filter((b) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const matchBiz = b.name.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
      const matchProd = b.products?.some((p) => p.name.toLowerCase().includes(q));
      return matchBiz || matchProd;
    })
    .sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance;
      return (b.avg_rating || 0) - (a.avg_rating || 0);
    });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= Math.round(rating) ? "text-accent fill-accent" : "text-muted"}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">ConnectHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/customer-dashboard"><Button variant="outline" size="sm">My Dashboard</Button></Link>
            <Link to="/auth"><Button variant="ghost" size="sm">Sign In</Button></Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">
            Find <span className="gradient-primary bg-clip-text text-transparent">Products & Services</span>
          </h1>
          <p className="text-muted-foreground">Search for custom products near you</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder='Search products (e.g., "custom t-shirts", "business cards")'
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-12 gap-2"
              onClick={detectLocation}
              disabled={locationLoading}
            >
              {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {userLocation ? "Location Set" : "Use My Location"}
            </Button>
          </div>
          {userLocation && (
            <p className="text-sm text-secondary flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Showing results sorted by distance
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No businesses found</p>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((biz) => (
              <Link key={biz.id} to={`/business/${biz.id}`}>
                <Card className="h-full hover:shadow-primary transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{biz.name}</h3>
                        <Badge variant="secondary" className="mt-1">{biz.category}</Badge>
                      </div>
                      {biz.distance !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {biz.distance.toFixed(0)} mi
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{biz.description}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(biz.avg_rating || 0)}
                      <span className="text-sm text-muted-foreground">
                        ({biz.review_count} review{biz.review_count !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {biz.city}, {biz.state}
                    </div>
                    {biz.products && biz.products.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {biz.products.slice(0, 3).map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{p.name}</Badge>
                        ))}
                        {biz.products.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{biz.products.length - 3} more</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
