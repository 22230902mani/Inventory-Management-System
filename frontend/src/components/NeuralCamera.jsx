import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralCamera = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const startCamera = async () => {
        try {
            setError(null);
            const constraints = {
                video: { facingMode: 'environment' }
            };
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera Access Error:", err);
            setError("Neural Link Failed: Could not access device camera. Please check permissions.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('camera-active');
            startCamera();
        } else {
            document.body.classList.remove('camera-active');
            stopCamera();
        }
        return () => {
            document.body.classList.remove('camera-active');
            stopCamera();
        };
    }, [isOpen]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsCapturing(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            setIsCapturing(false);
            onClose();
        }, 'image/jpeg', 0.9);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl h-[80vh] sm:h-auto sm:aspect-video bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Camera Header */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30 bg-gradient-to-b from-black/80 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Vision Active</span>
                            </div>
                            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors backdrop-blur-md">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Viewport */}
                        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                            {error ? (
                                <div className="text-center p-8 space-y-4 z-20">
                                    <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                                        <Zap className="text-rose-500" size={32} />
                                    </div>
                                    <p className="text-xs font-bold text-rose-400 max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
                                        {error}
                                    </p>
                                    <button
                                        onClick={startCamera}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all"
                                    >
                                        Retry Connection
                                    </button>
                                </div>
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Overlay UI Grid */}
                            <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-3xl" />
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                                {/* Corner Accents */}
                                <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                                <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                                <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                                <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
                            </div>

                            {/* Capture Button (Floating) */}
                            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center z-40">
                                <button
                                    onClick={captureImage}
                                    disabled={!stream || isCapturing}
                                    className="group relative w-20 h-20 rounded-full bg-white flex items-center justify-center transition-all active:scale-90 hover:scale-110 disabled:opacity-50 disabled:grayscale shadow-[0_0_30px_rgba(255,255,255,0.3)] pointer-events-auto"
                                >
                                    <div className="absolute inset-0 rounded-full border-4 border-white/30 scale-125 group-hover:scale-135 transition-transform" />
                                    <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center">
                                        <Camera size={28} className="text-black" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Hidden Canvas */}
                        <canvas ref={canvasRef} className="hidden" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NeuralCamera;
