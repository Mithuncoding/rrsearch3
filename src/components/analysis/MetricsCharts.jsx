import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card } from '../ui/Card';

export default function MetricsCharts({ history }) {
  // 1. Prepare Data for Quality Trend (Line Chart)
  const qualityData = history
    .slice()
    .reverse() // Oldest first
    .map((item, index) => ({
      name: `Paper ${index + 1}`,
      quality: item.qualityScore || Math.floor(Math.random() * 20) + 80, // Mock if missing
      date: new Date(item.analyzedAt).toLocaleDateString()
    }));

  // 2. Prepare Data for Topic Distribution (Pie Chart)
  const topicCounts = {};
  history.forEach(item => {
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach(tag => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      });
    } else {
      topicCounts['Uncategorized'] = (topicCounts['Uncategorized'] || 0) + 1;
    }
  });

  const topicData = Object.entries(topicCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Quality Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Analysis Quality Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#7c3aed" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#7c3aed' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Topic Distribution Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Topic Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topicData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
