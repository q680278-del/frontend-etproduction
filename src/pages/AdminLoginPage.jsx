import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { LiquidGlass } from '@liquidglass/react';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('effendi12344');
    const [password, setPassword] = useState('sahdbasdbhkajbaksd');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
            const response = await fetch(`${API_BASE}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admindashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0c16] text-white relative overflow-hidden">
            {/* Premium background with gradients */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#100c18] via-[#0f0c16] to-[#0c0a14] opacity-95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.25),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_32%)]" />

                {/* Animated particles */}
                <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `pulse-purple ${2 + Math.random() * 3}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
                <div className="max-w-md w-full">
                    {/* Header badge */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(139,92,246,0.35)] backdrop-blur mb-6">
                            <Sparkles className="h-4 w-4" />
                            Admin Portal
                        </div>

                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/60 to-blue-500/60 rounded-2xl mb-4 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                            <Lock className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>

                        <h1 className="text-4xl font-black mb-2">
                            <span className="shine-text">Admin Login</span>
                        </h1>
                        <p className="text-gray-400">E & T PRODUCTION Dashboard</p>
                    </div>

                    {/* Login card with liquid glass effect */}
                    <LiquidGlass
                        borderRadius={24}
                        blur={0.7}
                        contrast={1.2}
                        brightness={1.1}
                        saturation={1.2}
                        shadowIntensity={0.5}
                    >
                        <div className="glass-panel rounded-3xl p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-sm text-red-200">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
                                        Username
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm transition-all"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm transition-all"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-neon w-full py-4 rounded-xl text-base font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-5 w-5" />
                                            Login to Dashboard
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </LiquidGlass>

                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2 group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
