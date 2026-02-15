import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { day: "Mon", messages: 32 },
  { day: "Tue", messages: 45 },
  { day: "Wed", messages: 28 },
  { day: "Thu", messages: 56 },
  { day: "Fri", messages: 41 },
  { day: "Sat", messages: 18 },
  { day: "Sun", messages: 12 },
];

const hourlyData = [
  { hour: "6am", count: 4 },
  { hour: "8am", count: 12 },
  { hour: "10am", count: 28 },
  { hour: "12pm", count: 35 },
  { hour: "2pm", count: 30 },
  { hour: "4pm", count: 22 },
  { hour: "6pm", count: 15 },
  { hour: "8pm", count: 8 },
];

const responseData = [
  { name: "< 1h", value: 45 },
  { name: "1-3h", value: 30 },
  { name: "3-6h", value: 15 },
  { name: "> 6h", value: 10 },
];

const COLORS = ["hsl(221, 100%, 50%)", "hsl(186, 50%, 63%)", "hsl(30, 100%, 54%)", "hsl(0, 84%, 60%)"];

const AnalyticsDashboard = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">📊 Analytics Dashboard</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Messages This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="messages" fill="hsl(221, 100%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Peak Inquiry Times</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(186, 50%, 63%)" strokeWidth={2} dot={{ fill: "hsl(186, 50%, 63%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Response Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={responseData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {responseData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AnalyticsDashboard;
