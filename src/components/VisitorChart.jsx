import React, { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

/**
 * Visitor Analytics Chart Component
 * Shows trend of visitors over time with real-time updates
 */
const VisitorChart = ({ visitors = [], liveCount = 0 }) => {
    // Process visitor data into hourly buckets for last 24 hours
    const chartData = useMemo(() => {
        const now = new Date();
        const hours = [];

        // Generate 24 hour slots
        for (let i = 23; i >= 0; i--) {
            const hourDate = new Date(now - i * 60 * 60 * 1000);
            hours.push({
                hour: hourDate.getHours(),
                time: `${hourDate.getHours().toString().padStart(2, '0')}:00`,
                visitors: 0,
                timestamp: hourDate.getTime()
            });
        }

        // Count visitors per hour
        visitors.forEach(visitor => {
            const visitorTime = new Date(visitor.timestamp);
            const hourIndex = hours.findIndex(h => {
                const hourStart = new Date(h.timestamp);
                const hourEnd = new Date(h.timestamp + 60 * 60 * 1000);
                return visitorTime >= hourStart && visitorTime < hourEnd;
            });

            if (hourIndex !== -1) {
                hours[hourIndex].visitors += 1;
            }
        });

        return hours;
    }, [visitors]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = visitors.length;
        const last24h = visitors.filter(v => {
            const visitorTime = new Date(v.timestamp);
            return (Date.now() - visitorTime.getTime()) < 24 * 60 * 60 * 1000;
        }).length;

        const maxHourly = Math.max(...chartData.map(d => d.visitors), 0);
        const avgHourly = chartData.length > 0
            ? Math.round(chartData.reduce((sum, d) => sum + d.visitors, 0) / chartData.length)
            : 0;

        return { total, last24h, maxHourly, avgHourly };
    }, [visitors, chartData]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel rounded-lg p-3 border border-purple-500/30 shadow-lg">
                    <p className="text-white font-bold text-sm mb-1">{payload[0].payload.time}</p>
                    <p className="text-purple-300 text-sm">
                        👥 <span className="font-semibold">{payload[0].value}</span> visitors
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/60 to-blue-500/60 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black">Visitor Analytics</h2>
                    </div>
                    <p className="text-gray-400 text-sm">Last 24 hours traffic overview</p>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 md:px-4 py-2 rounded-full">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-green-300 font-bold text-sm">
                            {liveCount} online
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
                    <p className="text-gray-400 text-xs md:text-sm mb-1">Total Visitors</p>
                    <p className="text-2xl md:text-3xl font-black text-purple-300">{stats.total}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
                    <p className="text-gray-400 text-xs md:text-sm mb-1">Last 24h</p>
                    <p className="text-2xl md:text-3xl font-black text-blue-300">{stats.last24h}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
                    <p className="text-gray-400 text-xs md:text-sm mb-1">Peak Hour</p>
                    <p className="text-2xl md:text-3xl font-black text-green-300">{stats.maxHourly}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
                    <p className="text-gray-400 text-xs md:text-sm mb-1">Avg/Hour</p>
                    <p className="text-2xl md:text-3xl font-black text-yellow-300">{stats.avgHourly}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="time"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VisitorChart;
