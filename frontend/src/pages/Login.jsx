import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(email, password, adminCode);
        if (!result.success) {
            setError(result.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#161616] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            {/* Navbar */}
            <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
                <div className="text-2xl font-bold tracking-tight">Smart IMS</div>
                <div className="flex items-center gap-8 text-sm font-medium text-white/70">
                    <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                    <Link to="/register" className="px-6 py-2 border border-white/20 rounded-full hover:bg-white text-white hover:text-black transition-all">SignUp</Link>
                </div>
            </nav>

            {/* Background Ambiance */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-pink-900/20 rounded-full blur-[150px] pointer-events-none" />

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen px-4 py-20 relative z-10">
                <div
                    className="w-full max-w-[1100px] h-[650px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl flex relative overflow-hidden"
                >
                    {/* Left Side - 3D Character */}
                    <div className="w-1/2 relative hidden lg:flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                        <div className="absolute inset-0 bg-black/10 z-0" />
                        <img
                            src="/monkey.png"
                            alt="3D Character"
                            className="w-[85%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 relative"
                        />
                        {/* Reflection/Ground Effect */}
                        <div className="absolute bottom-10 w-[60%] h-12 bg-black/40 blur-xl rounded-full z-0" />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center p-12 lg:p-20 relative bg-black/20">
                        {/* Form Container */}
                        <div className="max-w-sm mx-auto w-full">
                            <h2 className="text-3xl font-bold mb-2">Login Account</h2>
                            <p className="text-white/40 text-sm mb-8">Welcome back, operative.</p>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center font-bold">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1 group">
                                    <label className="text-xs font-medium text-white/50 group-focus-within:text-pink-500 transition-colors ml-1">Enter Your Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-white text-black border border-white/10 py-2.5 px-4 rounded-xl placeholder-black/30 focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-medium"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-xs font-medium text-white/50 group-focus-within:text-pink-500 transition-colors ml-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-white text-black border border-white/10 py-2.5 px-4 rounded-xl placeholder-black/30 focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="space-y-1 group">
                                    <label className="text-xs font-medium text-white/50 group-focus-within:text-pink-500 transition-colors ml-1">Verification Code (For Admins)</label>
                                    <input
                                        type="password"
                                        value={adminCode}
                                        onChange={e => setAdminCode(e.target.value)}
                                        className="w-full bg-white text-black border border-white/10 py-2.5 px-4 rounded-xl placeholder-black/30 focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all font-medium text-center tracking-widest"
                                        placeholder="System Key"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#db2777] hover:bg-[#be185d] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/30 transition-all mt-4 transform hover:scale-105 active:scale-95 text-sm"
                                >
                                    {loading ? 'Authenticating...' : 'Login'}
                                </button>

                                <div className="text-center pt-2">
                                    <Link to="/forgot-password" className="text-xs text-white/40 hover:text-white transition-colors">Forget Password?</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
