import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralButton from '../components/ui/NeuralButton';

const ResetPassword = () => {
    const location = useLocation();
    const [email] = useState(location.state?.email || '');
    const [otp] = useState(location.state?.otp || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Access Keys do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:6700/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setMsg('Identity Re-secured Successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Override Protocol Failed');
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans py-12">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                    <NeuralCard className="p-8 backdrop-blur-2xl" variant="default">
                        <div className="text-center space-y-2 mb-10">
                            <motion.div
                                className="w-16 h-16 bg-gradient-to-tr from-brand-pink to-brand-blue rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-pink/20"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            >
                                <RefreshCw className="text-white" size={32} />
                            </motion.div>
                            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Re-Secure</h2>
                            <p className="text-[10px] font-extrabold text-white/30 tracking-[0.4em] uppercase">Credential Re-Encryption</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        {msg && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-4 bg-brand-green/10 border border-brand-green/20 rounded-xl text-brand-green text-xs font-bold text-center"
                            >
                                ✨ {msg}
                            </motion.div>
                        )}

                        {!msg && (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-[42px] text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
                                        <NeuralInput
                                            label="New Access Key"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="pl-12 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-[42px] text-white/20 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-[42px] text-white/20 group-focus-within:text-brand-green transition-colors" size={18} />
                                        <NeuralInput
                                            label="Confirm Key"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="pl-12 pr-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <NeuralButton
                                    className="w-full py-4 text-sm font-black uppercase tracking-[0.2em]"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Securing...' : (
                                        <span className="flex items-center justify-center gap-2">
                                            Finalize Re-Encryption <ArrowRight size={18} />
                                        </span>
                                    )}
                                </NeuralButton>
                            </form>
                        )}

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em] hover:text-brand-pink transition-colors"
                            >
                                Back to Access Terminal
                            </Link>
                        </div>
                    </NeuralCard>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">Identity re-sharding in progress // high entropy</p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
