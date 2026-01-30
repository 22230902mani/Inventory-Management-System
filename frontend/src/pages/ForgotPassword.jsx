import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Key, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralButton from '../components/ui/NeuralButton';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        setError('');
        try {
            const { data } = await axios.post('http://localhost:6700/api/auth/forgot-password', { email });
            setMsg(data.message);
            setTimeout(() => {
                navigate('/verify-reset', { state: { email } });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred');
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
                                className="w-16 h-16 bg-gradient-to-tr from-brand-blue to-teal-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                <Key className="text-white" size={32} />
                            </motion.div>
                            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Reset Signal</h2>
                            <p className="text-[10px] font-extrabold text-white/30 tracking-[0.4em] uppercase">Credential Recovery Protocol</p>
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
                                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center"
                            >
                                ✨ {msg}
                            </motion.div>
                        )}

                        {!msg && (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-white/40 text-center uppercase tracking-widest leading-relaxed">
                                        Input your linked operative email to initiate the biometric override code.
                                    </p>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-[42px] text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
                                        <NeuralInput
                                            label="Operative Email"
                                            type="email"
                                            placeholder="ident@coreims.sys"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <NeuralButton
                                    className="w-full py-4 text-sm font-black uppercase tracking-[0.2em]"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Transmitting...' : (
                                        <span className="flex items-center justify-center gap-2">
                                            Emit Reset Signal <ArrowRight size={18} />
                                        </span>
                                    )}
                                </NeuralButton>
                            </form>
                        )}

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors"
                            >
                                <ArrowLeft size={12} /> Return to Secure Link
                            </Link>
                        </div>
                    </NeuralCard>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">Recovery mode active // signal strength high</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
