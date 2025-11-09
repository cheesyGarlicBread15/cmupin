import AppLayout from '../layouts/AppLayout';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

export default function Dashboard({ stats, hazards }) {
    const STATUS_COLORS = {
        Safe: '#22c55e',        // green
        'At Risk': '#eab308',   // yellow
        'Need Rescue': '#ef4444', // red
        Evacuated: '#3b82f6',   // blue
    };

    // Household stats
    const householdStats = [
        { name: 'Safe', value: stats.safe },
        { name: 'At Risk', value: stats.atRisk },
        { name: 'Need Rescue', value: stats.needRescue },
        { name: 'Evacuated', value: stats.evacuated },
    ];

    const riskPercent = ((stats.atRisk + stats.needRescue) / (stats.total || 1)) * 100;

    // Aggregate hazards by type for the chart
    const hazardData = hazards
        ? Object.values(
            hazards.reduce((acc, h) => {
                const key = h.hazard_type?.name || 'Unknown';
                if (!acc[key]) {
                    acc[key] = {
                        name: key,
                        value: 0,
                        color: h.hazard_type?.color || '#8884d8',
                    };
                }
                acc[key].value += 1;
                return acc;
            }, {})
        )
        : [];

    return (
        <AppLayout>
            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                </div>

                {/* Household Summary Cards */}
                <div className="grid gap-6 md:grid-cols-5">
                    <SummaryCard title="Total Households" value={stats.total} color="text-white" />
                    <SummaryCard title="Safe" value={stats.safe} color="text-green-400" />
                    <SummaryCard title="At Risk" value={stats.atRisk} color="text-yellow-400" />
                    <SummaryCard title="Need Rescue" value={stats.needRescue} color="text-red-400" />
                    <SummaryCard title="Evacuated" value={stats.evacuated} color="text-blue-400" />
                </div>

                {/* Risk Progress */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-md">
                    <h2 className="text-lg font-semibold text-white mb-3">Risk Summary</h2>
                    <div className="text-gray-300 mb-2">
                        {riskPercent.toFixed(1)}% of households are currently at risk or need rescue
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                        <div
                            className="bg-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${riskPercent}%` }}
                        ></div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Household Status Pie Chart */}
                    <ChartCard title="Household Status Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={householdStats.filter(d => d.value > 0)}
                                    nameKey="name"
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    label={({ name, value }) => `${name} (${value})`}
                                    labelLine={false}
                                >
                                    {householdStats
                                        .filter(d => d.value > 0)
                                        .map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={STATUS_COLORS[entry.name]}
                                                stroke="#1f2937"
                                                strokeWidth={2}
                                            />
                                        ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '6px',
                                        color: '#fff',
                                    }}
                                    formatter={(value, name) => [`${value} households`, `${name}`]}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    wrapperStyle={{ color: '#ccc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Hazard Type Pie Chart */}
                    <ChartCard title="Hazard Type Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={hazardData}
                                    nameKey="name"
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    label={({ name, value }) => `${name} (${value})`}
                                    labelLine={false}
                                >
                                    {hazardData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                            stroke="#1f2937"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '6px',
                                        color: '#fff',
                                    }}
                                    formatter={(value, name) => [`${value} reports`, `${name}`]}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    wrapperStyle={{ color: '#ccc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </AppLayout>
    );
}

function SummaryCard({ title, value, color }) {
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow p-5 text-center hover:shadow-red-500/20 transition-all">
            <h3 className="text-sm text-gray-400">{title}</h3>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-md p-6 hover:shadow-red-500/20 transition-all">
            <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
            {children}
        </div>
    );
}
