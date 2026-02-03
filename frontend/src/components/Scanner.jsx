import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Image as ImageIcon, Upload, Scan } from 'lucide-react';
import NeuralCard from './ui/NeuralCard';
import NeuralButton from './ui/NeuralButton';

const Scanner = ({ onScan, onClose }) => {
    const [scannerId] = useState(() => `scanner-${Math.random().toString(36).substr(2, 9)}`);
    const [error, setError] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [scanMode, setScanMode] = useState('camera'); // 'camera' | 'file'
    const [dragActive, setDragActive] = useState(false);

    // Track the scanner instance
    const html5QrCodeRef = useRef(null);
    const fileInputRef = useRef(null);

    // Camera Lifecycle Management
    useEffect(() => {
        let isMounted = true;
        let cameraRunning = false;

        const manageCamera = async () => {
            if (scanMode !== 'camera') return;

            await new Promise(resolve => setTimeout(resolve, 150));
            if (!isMounted) return;

            const element = document.getElementById(scannerId);
            if (!element) return;

            try {
                if (!html5QrCodeRef.current) {
                    html5QrCodeRef.current = new Html5Qrcode(scannerId);
                }
                const scanner = html5QrCodeRef.current;

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 280, height: 130 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        if (isMounted) {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onScan(decodedText);
                        }
                    },
                    () => { }
                );

                cameraRunning = true;
                if (isMounted) {
                    setPermissionGranted(true);
                    setError(null);
                }

            } catch (err) {
                console.error("Camera start failed", err);
                if (isMounted) {
                    let msg = "Could not access camera.";
                    if (err.name === 'NotAllowedError') msg = "Access denied. Please check permissions.";
                    if (err.name === 'NotFoundError') msg = "No camera device found.";
                    setError(msg);
                }
            }
        };

        manageCamera();

        return () => {
            isMounted = false;
            if (html5QrCodeRef.current && cameraRunning) {
                html5QrCodeRef.current.stop().then(() => {
                    html5QrCodeRef.current.clear();
                    cameraRunning = false;
                }).catch(console.warn);
            }
        };
    }, [scanMode, onScan, scannerId]);

    const handleFileUpload = async (file) => {
        if (!file) return;
        try {
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode(scannerId);
            }
            const result = await html5QrCodeRef.current.scanFile(file, false);
            if (result) {
                if (navigator.vibrate) navigator.vibrate(50);
                onScan(result);
            }
        } catch (err) {
            setError("No barcode found in image.");
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleClose = async () => {
        try {
            if (html5QrCodeRef.current) {
                // Attempt to stop the scanner if it's running
                try {
                    await html5QrCodeRef.current.stop();
                } catch (ignore) {
                    // Start might not be complete, or already stopped
                }
                html5QrCodeRef.current.clear();
            }
        } catch (err) {
            console.warn("Error stopping scanner:", err);
        } finally {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-[var(--card-bg)] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-500">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[var(--card-border)] flex items-center justify-between bg-transparent">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl ${scanMode === 'camera' ? 'bg-brand-blue/20 text-brand-blue' : 'bg-brand-pink/20 text-brand-pink'}`}>
                            {scanMode === 'camera' ? <Camera size={20} /> : <ImageIcon size={20} />}
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                            {scanMode === 'camera' ? 'Neural Scan' : 'Import Signal'}
                        </h3>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-opacity-80 transition-all border border-[var(--card-border)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mode Switcher */}
                <div className="p-1 mx-6 mt-6 bg-[var(--input-bg)] rounded-2xl flex relative border border-[var(--card-border)]">
                    <button
                        onClick={() => { setScanMode('camera'); setError(null); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${scanMode === 'camera' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm border border-[var(--card-border)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        <Scan size={14} /> Camera
                    </button>
                    <button
                        onClick={() => { setScanMode('file'); setError(null); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${scanMode === 'file' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm border border-[var(--card-border)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        <Upload size={14} /> File
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col min-h-[400px]">
                    {error && (
                        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 dark:text-rose-400 text-xs font-bold animate-in shake-in duration-300">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="relative flex-1 bg-black rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-inner">
                        {scanMode === 'camera' ? (
                            <>
                                <div id={scannerId} className="w-full h-full"></div>
                                {!error && permissionGranted && (
                                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                                        <div className="w-[280px] h-[130px] border-2 border-brand-blue/50 rounded-2xl shadow-[0_0_0_1000px_rgba(0,0,0,0.6)] relative">
                                            <div className="absolute -inset-1 border-2 border-brand-blue/20 rounded-2xl animate-pulse"></div>
                                            {/* Corners */}
                                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-brand-blue"></div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-brand-blue"></div>
                                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-brand-blue"></div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-brand-blue"></div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${dragActive ? 'border-brand-blue bg-brand-blue/5' : 'border-white/10 hover:bg-white/5'}`}
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={24} className={dragActive ? 'text-brand-blue' : 'text-white/60'} />
                                </div>
                                <p className="text-sm font-bold text-white mb-1">
                                    {dragActive ? 'Release Signal' : 'Upload Decryption Image'}
                                </p>
                                <p className="text-[10px] text-white/50 uppercase tracking-[0.2em]">or drag and drop</p>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0])} />
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <p className="text-[9px] text-[var(--text-secondary)] opacity-50 text-center font-bold uppercase tracking-[0.3em]">
                            Align barcode within retrieval zone
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scanner;
