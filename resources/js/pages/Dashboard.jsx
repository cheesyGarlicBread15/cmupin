import AppLayout from '../layouts/AppLayout';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Legend,
} from 'recharts';

export default function Dashboard() {
    // --- Sample data (replace with props or API data) ---
    const householdStats = [
        { name: 'Safe', value: 189 },
        { name: 'At Risk', value: 14 },
        { name: 'Need Rescue', value: 18 },
    ];

    const precipitationTrend = [
        { time: '1 AM', value: 2 },
        { time: '2 AM', value: 3 },
        { time: '3 AM', value: 5 },
        { time: '4 AM', value: 8 },
        { time: '5 AM', value: 6 },
        { time: '6 AM', value: 10 },
        { time: '7 AM', value: 12 },
    ];

    const barangayData = [
        { name: 'Barangay 1', atRisk: 15, needRescue: 3 },
        { name: 'Barangay 2', atRisk: 8, needRescue: 5 },
        { name: 'Barangay 3', atRisk: 12, needRescue: 2 },
        { name: 'Barangay 4', atRisk: 5, needRescue: 1 },
        { name: 'Barangay 5', atRisk: 9, needRescue: 4 },
    ];

    const COLORS = ['#22c55e', '#eab308', '#ef4444'];

    return (
        <AppLayout>
            <div className="p-6 space-y-6">
                {/* --- Summary Cards --- */}
                <div className="grid gap-6 md:grid-cols-4">
                    <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
                        <h3 className="text-sm text-gray-400">Total Households</h3>
                        <p className="text-3xl font-bold text-white mt-2">221</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
                        <h3 className="text-sm text-gray-400">Safe</h3>
                        <p className="text-3xl font-bold text-green-400 mt-2">189</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
                        <h3 className="text-sm text-gray-400">At Risk</h3>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">14</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
                        <h3 className="text-sm text-gray-400">Need Rescue</h3>
                        <p className="text-3xl font-bold text-red-400 mt-2">18</p>
                    </div>
                </div>

                {/* --- Charts Section --- */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Household Status Pie Chart */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Household Status Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={householdStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {householdStats.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Precipitation Trend Line Chart */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Precipitation Trend (Last 24 Hours)
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={precipitationTrend}>
                                <XAxis dataKey="time" stroke="#ccc" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Affected Households by Barangay */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Affected Households by Barangay
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barangayData}>
                                <XAxis dataKey="name" stroke="#ccc" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="atRisk" stackId="a" fill="#eab308" />
                                <Bar dataKey="needRescue" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
