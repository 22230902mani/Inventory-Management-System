import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, Fingerprint } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralButton from '../components/ui/NeuralButton';

const VerifyReset = () => {
    const location = useLocation();
    const [email] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:6700/api/auth/verify-reset-code', { email, otp });
            setMsg('Protocol Verified');
            setTimeout(() => {
                navigate('/reset-password', { state: { email, otp } });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Signal Code');
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
                                className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-brand-blue rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Fingerprint className="text-white" size={32} />
                            </motion.div>
                            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Verify Identity</h2>
                            <p className="text-[10px] font-extrabold text-white/30 tracking-[0.4em] uppercase">Auth-Signal Synchronizer</p>
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
                                className="mb-6 p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-brand-blue text-xs font-bold text-center"
                            >
                                ✅ {msg}
                            </motion.div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-white/40 text-center uppercase tracking-widest leading-relaxed px-4">
                                    Transmission sent to <span className="text-brand-blue">{email}</span>. Input the 6-digit sync-key.
                                </p>
                                <div className="relative group">
                                    <NeuralInput
                                        placeholder="0 0 0 0 0 0"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength={6}
                                        className="text-center text-2xl font-black tracking-[0.5em] h-16 border-white/20 focus:border-brand-blue focus:ring-brand-blue/20"
                                        required
                                    />
                                </div>
                            </div>

                            <NeuralButton
                                className="w-full py-4 text-sm font-black uppercase tracking-[0.2em]"
                                type="submit"
                                disabled={loading || otp.length < 6}
                            >
                                {loading ? 'Synchronizing...' : (
                                    <span className="flex items-center justify-center gap-2">
                                        Verify Protocol <ShieldCheck size={18} />
                                    </span>
                                )}
                            </NeuralButton>
                        </form>

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors"
                            >
                                <ArrowLeft size={12} /> Abort Recovery
                            </Link>
                        </div>
                    </NeuralCard>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">Waiting for manual input // secure handshake</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyReset;
