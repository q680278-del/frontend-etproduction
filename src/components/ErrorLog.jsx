import React from 'react';
import { AlertTriangle, Code, Server, FileQuestion, Clock } from 'lucide-react';

/**
 * Error Log Component
 * Displays recent errors and error statistics
 */
const ErrorLog = ({ errorStats }) => {
    if (!errorStats) {
        return (
            <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10">
                <p className="text-gray-400 text-center">Loading error logs...</p>
            </div>
        );
    }

    const { last24h, recentErrors = [] } = errorStats;

    // Get icon for error type
    const getErrorIcon = (type) => {
        switch (type) {
            case 'javascript':
                return <Code className="w-4 h-4" />;
            case 'api':
                return <Server className="w-4 h-4" />;
            case '404':
                return <FileQuestion className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    // Get badge color for error type
    const getTypeColor = (type) => {
        switch (type) {
            case 'javascript':
                return 'bg-red-500/20 border-red-500/30 text-red-300';
            case 'api':
                return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
            case '404':
                return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
            default:
                return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
        }
    };

    // Get severity badge color
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-600/30 border-red-600/50 text-red-200';
            case 'error':
                return 'bg-red-500/20 border-red-500/30 text-red-300';
            case 'warning':
                return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
            case 'info':
                return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
            default:
                return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/60 to-orange-500/60 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black">Error Tracking</h2>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm">Last 24 hours error monitoring</p>
                </div>
            </div>

            {/* Error Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-3 md:p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-red-400" />
                        <p className="text-gray-400 text-xs font-bold uppercase">JS Errors</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-red-300">{last24h?.jsErrors || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-3 md:p-4 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Server className="w-4 h-4 text-orange-400" />
                        <p className="text-gray-400 text-xs font-bold uppercase">API Errors</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-orange-300">{last24h?.apiErrors || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-3 md:p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <FileQuestion className="w-4 h-4 text-yellow-400" />
                        <p className="text-gray-400 text-xs font-bold uppercase">404 Errors</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-yellow-300">{last24h?.notFoundErrors || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-3 md:p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-purple-400" />
                        <p className="text-gray-400 text-xs font-bold uppercase">Total</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-purple-300">{last24h?.total || 0}</p>
                </div>
            </div>

            {/* Recent Errors Table */}
            <div>
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Recent Errors
                </h3>

                {recentErrors.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No errors logged</p>
                        <p className="text-sm text-gray-500">System is running smoothly! 🎉</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentErrors.map((error, index) => (
                            <div
                                key={error.id || index}
                                className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10 hover:border-red-500/30 transition-colors group"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            {/* Type badge */}
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${getTypeColor(error.type)}`}>
                                                {getErrorIcon(error.type)}
                                                {error.type?.toUpperCase()}
                                            </span>

                                            {/* Severity badge */}
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold ${getSeverityColor(error.severity)}`}>
                                                {error.severity?.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Error message */}
                                        <p className="text-white text-sm md:text-base font-semibold mb-1 line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {error.message}
                                        </p>

                                        {/* Additional info */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                                            {error.url && (
                                                <span className="font-mono truncate max-w-xs">
                                                    📍 {error.url}
                                                </span>
                                            )}
                                            {error.path && (
                                                <span className="font-mono truncate max-w-xs">
                                                    📍 {error.path}
                                                </span>
                                            )}
                                            {error.endpoint && (
                                                <span className="font-mono">
                                                    🔗 {error.method} {error.endpoint}
                                                </span>
                                            )}
                                            {error.statusCode && (
                                                <span className="font-bold text-orange-400">
                                                    {error.statusCode}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(error.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorLog;
