import React from 'react';
import { Cpu, MemoryStick, Clock, HardDrive, Server } from 'lucide-react';

/**
 * System Health Card Component
 * Displays real-time system metrics (CPU, RAM, Uptime, Disk)
 */
const SystemHealthCard = ({ health }) => {
    if (!health) {
        return (
            <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10">
                <p className="text-gray-400 text-center">Loading system health...</p>
            </div>
        );
    }

    const { cpu, memory, disk, uptime, processUptime } = health;

    // Helper to get status color based on usage percentage
    const getStatusColor = (percent) => {
        if (percent < 50) return 'green';
        if (percent < 75) return 'yellow';
        return 'red';
    };

    // CPU color
    const cpuColor = getStatusColor(cpu?.usage || 0);
    const cpuGradient = {
        green: 'from-green-600 to-emerald-600',
        yellow: 'from-yellow-600 to-orange-600',
        red: 'from-red-600 to-rose-600'
    }[cpuColor];

    // Memory color
    const memColor = getStatusColor(memory?.usagePercent || 0);
    const memGradient = {
        green: 'from-blue-600 to-cyan-600',
        yellow: 'from-yellow-600 to-orange-600',
        red: 'from-red-600 to-rose-600'
    }[memColor];

    // Disk color
    const diskColor = getStatusColor(disk?.usagePercent || 0);
    const diskGradient = {
        green: 'from-purple-600 to-violet-600',
        yellow: 'from-yellow-600 to-orange-600',
        red: 'from-red-600 to-rose-600'
    }[diskColor];

    return (
        <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600/60 to-emerald-500/60 flex items-center justify-center">
                    <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black">System Health</h2>
                    <p className="text-gray-400 text-xs md:text-sm">Real-time server monitoring</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {/* CPU Usage */}
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:border-green-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${cpuGradient} flex items-center justify-center shadow-lg`}>
                            <Cpu className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <span className={`text-xl md:text-2xl font-black text-${cpuColor}-300`}>
                            {cpu?.usage || 0}%
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">CPU Usage</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-1">{cpu?.cores || 0} cores</p>

                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${cpuGradient} transition-all duration-500`}
                            style={{ width: `${cpu?.usage || 0}%` }}
                        />
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${memGradient} flex items-center justify-center shadow-lg`}>
                            <MemoryStick className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <span className={`text-xl md:text-2xl font-black text-${memColor}-300`}>
                            {memory?.usagePercent || 0}%
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Memory</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-1">
                        {memory?.used || 0} / {memory?.total || 0} GB
                    </p>

                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${memGradient} transition-all duration-500`}
                            style={{ width: `${memory?.usagePercent || 0}%` }}
                        />
                    </div>
                </div>

                {/* Uptime */}
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg">
                            <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <span className="text-sm md:text-base font-black text-purple-300">
                            {processUptime?.days || 0}d
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">App Uptime</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-1">
                        {processUptime?.formatted || '0d 0h 0m'}
                    </p>

                    {/* Uptime badge */}
                    <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-[10px] md:text-xs font-semibold">
                            🟢 Healthy
                        </span>
                    </div>
                </div>

                {/* Disk Usage */}
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:border-violet-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${diskGradient} flex items-center justify-center shadow-lg`}>
                            <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <span className={`text-xl md:text-2xl font-black text-${diskColor}-300`}>
                            {disk?.usagePercent || 0}%
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Disk Space</p>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-1">
                        {disk?.used || 0} / {disk?.total || 0} GB
                    </p>

                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${diskGradient} transition-all duration-500`}
                            style={{ width: `${disk?.usagePercent || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* System Info */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                    <div className="text-gray-400">
                        <span className="font-semibold">Platform:</span> {health.platform || 'Unknown'}
                    </div>
                    <div className="text-gray-400">
                        <span className="font-semibold">Hostname:</span> {health.hostname || 'Unknown'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthCard;
