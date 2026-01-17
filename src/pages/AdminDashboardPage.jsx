import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Globe, MapPin, Clock, LogOut, RefreshCw, TrendingUp, Sparkles, Eye, Activity, Bell } from 'lucide-react';

// Import new components
import VisitorChart from '../components/VisitorChart';
import SystemHealthCard from '../components/SystemHealthCard';
import ErrorLog from '../components/ErrorLog';
import usePolling from '../hooks/usePolling';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [systemHealth, setSystemHealth] = useState(null);

    const [errorStats, setErrorStats] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Visitor Table State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Polling for real-time updates (replaces Socket.IO)
    const { data: liveHealth } = usePolling('/api/system/quick-stats', 5000);
    const { data: liveNotifications } = usePolling('/api/notifications', 10000);

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('adminToken');

        if (!token) {
            navigate('/adminlogin');
            return;
        }

        try {
            setLoading(true);
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
            const response = await fetch(`${API_BASE}/api/admin/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/adminlogin');
                return;
            }

            const data = await response.json();

            if (data.success) {
                setAnalytics(data.data);
            } else {
                setError(data.message || 'Failed to fetch analytics');
            }
        } catch (err) {
            setError('Failed to load analytics. Please check your connection.');
            console.error('Analytics fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch error stats from API
    const fetchErrorStats = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
            const response = await fetch(`${API_BASE}/api/system/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setErrorStats(data.data);
                }
            }
        } catch (err) {
            console.error('Error stats fetch error:', err);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        fetchSystemHealth();
        fetchErrorStats();
    }, []);
    // Update system health from Socket.io
    useEffect(() => {
        if (liveHealth) {
            setSystemHealth(prev => {
                // If we don't have previous data, create a basic structure with live data
                if (!prev) {
                    return {
                        cpu: {
                            usage: typeof liveHealth.cpu === 'number' ? liveHealth.cpu : 0,
                            cores: 0, // Unknown until full fetch
                            model: 'Loading...'
                        },
                        memory: {
                            total: 0,
                            used: 0,
                            free: 0,
                            usagePercent: liveHealth.memoryPercent || 0
                        },
                        disk: {
                            total: 0,
                            used: 0,
                            free: 0,
                            usagePercent: 0,
                            mount: '/'
                        },
                        uptime: {
                            formatted: 'Calculating...'
                        },
                        processUptime: {
                            formatted: 'Calculating...'
                        },
                        platform: 'Loading...',
                        hostname: 'Loading...',
                        timestamp: new Date().toISOString()
                    };
                }

                // Merge live data with existing full data
                return {
                    ...prev,
                    cpu: {
                        ...prev.cpu,
                        usage: typeof liveHealth.cpu === 'number' ? liveHealth.cpu : prev.cpu.usage
                    },
                    memory: {
                        ...prev.memory,
                        usagePercent: liveHealth.memoryPercent
                    }
                };
            });
        }
    }, [liveHealth]);

    // Update visitor list from Socket
    useEffect(() => {
        if (visitors && visitors.length > 0 && analytics) {
            setAnalytics(prev => {
                if (!prev) return prev;

                // Merge new visitors with existing list, avoiding duplicates by ID or timestamp
                // Note: Socket provides recent visitors. We prepend them.
                // Simple approach: Take socket visitors, add current visitors, filter duplicates, limit to 100
                const combined = [...visitors, ...prev.visitors];

                // Remove duplicates based on ID or unique features if ID missing
                const unique = Array.from(new Map(combined.map(item => [item.id || item.timestamp, item])).values());

                // Sort by newness
                unique.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                return {
                    ...prev,
                    visitors: unique,
                    totalVisits: unique.length, // Update count
                    uniqueVisitors: new Set(unique.map(v => v.ip)).size // Update unique count
                };
            });
        }
    }, [visitors]);

    // Update error stats from Socket.io
    useEffect(() => {
        if (liveErrorStats) {
            setErrorStats(liveErrorStats);
        }
    }, [liveErrorStats]);

    // Fetch system health from API
    const fetchSystemHealth = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
            const response = await fetch(`${API_BASE}/api/system/health`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setSystemHealth(data.data);
                }
            }
        } catch (err) {
            console.error('System health fetch error:', err);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('adminToken');

        if (token) {
            try {
                const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
                await fetch(`${API_BASE}/api/admin/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }

        localStorage.removeItem('adminToken');
        navigate('/adminlogin');
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0c16] relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#100c18] via-[#0f0c16] to-[#0c0a14] opacity-95" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.25),transparent_35%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_32%)]" />
                </div>
                <div className="relative flex items-center justify-center min-h-screen">
                    <div className="text-center space-y-4">
                        <svg className="animate-spin h-16 w-16 text-primary mx-auto drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-white text-xl font-bold shine-text">Loading Analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0c16] text-white relative overflow-hidden">
            {/* Premium animated background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#100c18] via-[#0f0c16] to-[#0c0a14] opacity-95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.25),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_32%)]" />

                {/* Floating particles */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `pulse-purple ${2 + Math.random() * 4}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
                {/* Premium Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(139,92,246,0.35)] backdrop-blur mb-6">
                        <Sparkles className="h-4 w-4" />
                        Admin Dashboard
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black mb-3">
                                <span className="shine-text">Analytics</span>
                            </h1>
                            <p className="text-gray-400 text-lg">E & T PRODUCTION Visitor Tracking</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={fetchAnalytics}
                                className="btn-glass btn-compact flex items-center gap-2 px-5 py-3"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                            <button
                                onClick={handleLogout}
                                className="btn-neon btn-compact flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 mb-4 md:mb-6 border-red-500/50 bg-red-500/10">
                        <p className="text-red-200 text-sm md:text-base">{error}</p>
                    </div>
                )}

                {/* Real-time Visitor Analytics Chart */}
                <div className="mb-6 md:mb-8">
                    <VisitorChart visitors={[...visitors, ...(analytics?.visitors || [])]} liveCount={liveCount} />
                </div>

                {/* System Health Monitoring */}
                <div className="mb-6 md:mb-8">
                    <SystemHealthCard health={systemHealth} />
                </div>

                {/* Error Tracking */}
                <div className="mb-6 md:mb-8">
                    <ErrorLog errorStats={errorStats} />
                </div>

                {/* Notification Manager */}
                <div className="mb-6 md:mb-8">
                    <div className="glass-panel rounded-2xl md:rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/60 to-orange-500/60 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-black">Notification Manager</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Create Form */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Create Notification</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const data = {
                                        title: formData.get('title'),
                                        message: formData.get('message'),
                                        type: formData.get('type'),
                                        isActive: true
                                    };

                                    // Send to API
                                    const token = localStorage.getItem('adminToken');
                                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/notifications`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify(data)
                                    })
                                        .then(res => res.json())
                                        .then(res => {
                                            if (res.success) {
                                                e.target.reset();
                                                setNotifications(prev => [res.data, ...prev]); // Update list immediately
                                                alert('Notification created!');
                                            } else {
                                                alert('Failed: ' + res.message);
                                            }
                                        });
                                }} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Title</label>
                                        <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="e.g. System Maintenance" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Message</label>
                                        <textarea name="message" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-h-[100px]" placeholder="Enter notification message..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Type</label>
                                        <select name="type" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
                                            <option value="info" className="bg-[#0f0c16]">Info (Blue)</option>
                                            <option value="success" className="bg-[#0f0c16]">Success (Green)</option>
                                            <option value="warning" className="bg-[#0f0c16]">Warning (Yellow)</option>
                                            <option value="error" className="bg-[#0f0c16]">Error (Red)</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-bold text-white shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-1">
                                        Broadcast Notification
                                    </button>
                                </form>
                            </div>

                            {/* List of Notifications */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Recent Notifications</h3>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {notifications.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No notifications found.</p>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 hover:bg-white/10 transition-all group">
                                                <div className={`w-1 h-auto rounded-full ${notif.type === 'success' ? 'bg-green-500' :
                                                    notif.type === 'warning' ? 'bg-yellow-500' :
                                                        notif.type === 'error' ? 'bg-red-500' :
                                                            'bg-blue-500'
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-white text-sm">{notif.title}</h4>
                                                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mb-3">{notif.message}</p>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm('Delete this notification?')) return;
                                                                const token = localStorage.getItem('adminToken');
                                                                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/notifications/${notif.id}`, {
                                                                    method: 'DELETE',
                                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                                });
                                                                if (res.ok) {
                                                                    setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                                                    // Also emit delete event via socket if connected/handled elsewhere
                                                                }
                                                            }}
                                                            className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                                                        >
                                                            Delete
                                                        </button>
                                                        {/* Edit functionality (simplified as delete + recreate is often easier, but lets assume edit) */}
                                                        <button
                                                            onClick={() => {
                                                                // Simple prompt-based edit for quick implementation as requested
                                                                const newTitle = prompt("Edit Title:", notif.title);
                                                                if (newTitle === null) return;
                                                                const newMessage = prompt("Edit Message:", notif.message);
                                                                if (newMessage === null) return;

                                                                const update = async () => {
                                                                    const token = localStorage.getItem('adminToken');
                                                                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/notifications/${notif.id}`, {
                                                                        method: 'PUT',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'Authorization': `Bearer ${token}`
                                                                        },
                                                                        body: JSON.stringify({ title: newTitle, message: newMessage })
                                                                    });
                                                                    if (res.ok) {
                                                                        const updated = await res.json();
                                                                        if (updated.success) {
                                                                            setNotifications(prev => prev.map(n => n.id === notif.id ? updated.data : n));
                                                                        }
                                                                    }
                                                                };
                                                                update();
                                                            }}
                                                            className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {analytics && (
                    <>

                        {/* Stats Cards with Pure CSS Glassmorphism */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            {[
                                {
                                    icon: TrendingUp,
                                    label: 'Total Visits',
                                    value: analytics.totalVisits,
                                    color: 'from-purple-600 to-violet-700',
                                    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                                },
                                {
                                    icon: Users,
                                    label: 'Unique Visitors',
                                    value: analytics.uniqueVisitors,
                                    color: 'from-blue-600 to-cyan-600',
                                    glow: 'shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                                },
                                {
                                    icon: Eye,
                                    label: 'Top IP Visits',
                                    value: analytics.topIPs[0]?.count || 0,
                                    color: 'from-green-600 to-emerald-600',
                                    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                                }
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className={`glass-panel rounded-2xl md:rounded-3xl p-5 md:p-6 ${stat.glow} hover:-translate-y-2 transition-all duration-300`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-4xl md:text-5xl font-black shine-text">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Visitors Table */}
                        <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/60 to-blue-500/60 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black">Recent Visitors</h2>
                                </div>

                                {/* Search and Count */}
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search IP, City, Country..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // Reset to page 1 on search
                                        }}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 w-full md:w-64 transition-all"
                                    />
                                    <div className="text-xs md:text-sm text-gray-400 bg-white/5 px-3 md:px-4 py-2 rounded-full border border-white/10 whitespace-nowrap">
                                        {analytics.visitors.length} records
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider py-3 md:py-4 px-2 md:px-4">IP</th>
                                                <th className="text-left text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider py-3 md:py-4 px-2 md:px-4">Location</th>
                                                <th className="hidden sm:table-cell text-left text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider py-3 md:py-4 px-2 md:px-4">Path</th>
                                                <th className="text-left text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider py-3 md:py-4 px-2 md:px-4">Time</th>
                                                <th className="hidden lg:table-cell text-left text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider py-3 md:py-4 px-2 md:px-4">User Agent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                // Filter Logic
                                                const filteredVisitors = analytics.visitors.filter(v =>
                                                    (v.ip || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (v.location?.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (v.location?.country || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (v.path || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                );

                                                // Pagination Logic
                                                const indexOfLastItem = currentPage * itemsPerPage;
                                                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                                                const currentItems = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
                                                const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

                                                if (currentItems.length === 0) {
                                                    return (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-8 text-gray-500 italic">No visitors found matching "{searchTerm}"</td>
                                                        </tr>
                                                    );
                                                }

                                                return (
                                                    <>
                                                        {currentItems.map((visitor, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                                            >
                                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                                    <code className="text-purple-300 font-mono text-xs md:text-sm bg-purple-500/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-purple-500/30">
                                                                        {visitor.ip}
                                                                    </code>
                                                                </td>
                                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                                    <div className="flex items-center gap-1 md:gap-2 text-gray-300">
                                                                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                                                                        <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-none">{visitor.location?.city || 'Unknown'}, {visitor.location?.country || 'Unknown'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="hidden sm:table-cell py-3 md:py-4 px-2 md:px-4">
                                                                    <code className="text-gray-400 text-xs font-mono bg-white/5 px-1.5 md:px-2 py-0.5 md:py-1 rounded truncate block max-w-[150px]">
                                                                        {visitor.path}
                                                                    </code>
                                                                </td>
                                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-300 text-xs md:text-sm font-medium">
                                                                            {new Date(visitor.timestamp).toLocaleTimeString()}
                                                                        </span>
                                                                        <span className="text-gray-500 text-[10px] md:text-xs">
                                                                            {new Date(visitor.timestamp).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="hidden lg:table-cell py-3 md:py-4 px-2 md:px-4">
                                                                    <span className="text-gray-500 text-xs truncate block max-w-[200px]" title={visitor.userAgent}>
                                                                        {visitor.userAgent?.replace('Mozilla/5.0', '')}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Pagination Controls Row */}
                                                        <tr>
                                                            <td colSpan="5" className="pt-6 pb-2">
                                                                <div className="flex justify-between items-center bg-white/5 rounded-xl p-2 border border-white/5">
                                                                    <button
                                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                                        disabled={currentPage === 1}
                                                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold uppercase transition-colors"
                                                                    >
                                                                        Previous
                                                                    </button>
                                                                    <span className="text-sm font-mono text-gray-400">
                                                                        Page <span className="text-white font-bold">{currentPage}</span> of {totalPages || 1}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                                        disabled={currentPage === totalPages || totalPages === 0}
                                                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold uppercase transition-colors"
                                                                    >
                                                                        Next
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            })()}
                                        </tbody>
                                        {/* END VISITOR ROWS */}

                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )
                }
            </div >
        </div >
    );
};

export default AdminDashboardPage;

