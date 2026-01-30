import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Image as ImageIcon, Upload, Scan } from 'lucide-react';

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
            // Only start camera if in camera mode
            if (scanMode !== 'camera') return;

            // Wait for DOM
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!isMounted) return;

            const element = document.getElementById(scannerId);
            if (!element) {
                if (isMounted) setError("Scanner initialization failed.");
                return;
            }

            try {
                // Ensure instance exists
                if (!html5QrCodeRef.current) {
                    html5QrCodeRef.current = new Html5Qrcode(scannerId);
                }
                const scanner = html5QrCodeRef.current;

                // Start Camera
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        // Rectangular scanning region for barcodes
                        qrbox: { width: 280, height: 130 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        if (isMounted) {
                            console.log("Scan success:", decodedText);
                            if (navigator.vibrate) navigator.vibrate(50);
                            onScan(decodedText);
                        }
                    },
                    (errorMessage) => {
                        // Ignore scanning errors
                    }
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
                    if (err.name === 'NotReadableError') msg = "Camera is used by another app.";
                    setError(msg);
                }
            }
        };

        manageCamera();

        // Cleanup: Stop camera when Mode changes or Component unmounts
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
            console.error("File input error", err);
            setError("No barcode found in image.");
            setTimeout(() => setError(null), 3000);
        }
    };

    // Drag and Drop handlers
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

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '480px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideUp 0.3s ease-out',
                maxHeight: '90vh'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: 8, background: scanMode === 'camera' ? '#EFF6FF' : '#FDF4FF', borderRadius: '50%', color: scanMode === 'camera' ? '#3B82F6' : '#D946EF', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                            {scanMode === 'camera' ? <Camera size={20} /> : <ImageIcon size={20} />}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                            {scanMode === 'camera' ? 'Scan Code' : 'Upload Image'}
                        </h3>
                    </div>

                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4B5563', transition: 'background 0.2s' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Mode Switcher */}
                <div style={{ padding: '4px', margin: '16px 24px 0', background: '#F3F4F6', borderRadius: '12px', display: 'flex', position: 'relative' }}>
                    <button
                        onClick={() => { setScanMode('camera'); setError(null); }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '10px',
                            background: scanMode === 'camera' ? 'white' : 'transparent',
                            color: scanMode === 'camera' ? '#374151' : '#6B7280',
                            boxShadow: scanMode === 'camera' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Scan size={16} /> Live Camera
                    </button>
                    <button
                        onClick={() => { setScanMode('file'); setError(null); }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '10px',
                            background: scanMode === 'file' ? 'white' : 'transparent',
                            color: scanMode === 'file' ? '#374151' : '#6B7280',
                            boxShadow: scanMode === 'file' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Upload size={16} /> Upload File
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', flex: 1, minHeight: '350px', display: 'flex', flexDirection: 'column' }}>

                    {/* Error Feedback */}
                    {error && (
                        <div style={{ padding: '12px', marginBottom: '16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', color: '#991B1B', fontSize: '0.9rem' }}>
                            <AlertCircle size={20} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Camera View */}
                    <div style={{
                        display: scanMode === 'camera' ? 'block' : 'none',
                        position: 'relative',
                        width: '100%',
                        height: '300px',
                        background: 'black',
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}>
                        <div id={scannerId} style={{ width: '100%', height: '100%' }}></div>
                        {/* Overlay / Guide : Updated to Rectangle */}
                        {!error && permissionGranted && scanMode === 'camera' && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '280px', height: '130px', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '12px', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)', pointerEvents: 'none', zIndex: 10 }}></div>
                        )}
                    </div>

                    {/* File Upload View */}
                    {scanMode === 'file' && (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                height: '300px',
                                border: `2px dashed ${dragActive ? '#3B82F6' : '#E5E7EB'}`,
                                borderRadius: '16px',
                                background: dragActive ? '#EFF6FF' : '#F9FAFB',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ width: 64, height: 64, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                                <Upload size={28} color={dragActive ? '#3B82F6' : '#9CA3AF'} />
                            </div>
                            <p style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                                {dragActive ? 'Drop image here' : 'Click to Upload'}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#9CA3AF' }}>or drag and drop</p>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0])} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Scanner;
