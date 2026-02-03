import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
    FileText,
    TrendingUp,
    PieChart as PieChartIcon,
    Activity,
    ShieldCheck,
    ChevronRight,
    Download
} from 'lucide-react';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';

const Reports = () => {
    const salesData = [
        { name: 'Jan', value: 12000 },
        { name: 'Feb', value: 19000 },
        { name: 'Mar', value: 3000 },
        { name: 'Apr', value: 5000 },
        { name: 'May', value: 2000 },
        { name: 'Jun', value: 30000 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 12 },
        { name: 'Furniture', value: 19 },
        { name: 'Clothing', value: 3 },
        { name: 'Others', value: 5 },
    ];

    const COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981'];
    const reportRef = useRef(null);

    const handleDownloadPDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        try {
            // Minimal visually disruptive loading state could go here
            const canvas = await html2canvas(element, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-primary') || '#000000', // Match theme
                logging: false,
                ignoreElements: (node) => node.tagName === 'BUTTON' // Optional: Ignore buttons in the PDF
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            // Center image
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`Strategic_Intel_Manifest_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("PDF Generation Failed:", error);
            alert("Failed to generate report manifest.");
        }
    };

    return (
        <div ref={reportRef} className="space-y-8 animate-in fade-in duration-700 p-4">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <FileText className="text-brand-blue" size={24} />
                        <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">Intel Reports</h2>
                    </div>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] tracking-[0.4em] uppercase ml-9">Strategic Analytics & Data Manifests</p>
                </div>

                <NeuralButton onClick={handleDownloadPDF} variant="secondary" className="bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <Download size={18} className="mr-2" /> Export Strategic Data
                </NeuralButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <NeuralCard className="h-[450px] flex flex-col" delay={0.1}>
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp size={20} className="text-brand-blue" />
                        <h4 className="text-lg font-bold text-[var(--text-primary)]">Monthly Capital Flow</h4>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: 'var(--tooltip-text)', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'var(--tooltip-text)', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </NeuralCard>

                <NeuralCard className="h-[450px] flex flex-col" delay={0.2}>
                    <div className="flex items-center gap-3 mb-8">
                        <PieChartIcon size={20} className="text-brand-pink" />
                        <h4 className="text-lg font-bold text-[var(--text-primary)]">Category Distribution Intel</h4>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: 'var(--tooltip-text)', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'var(--tooltip-text)', marginBottom: '4px' }}
                                />
                                <Legend verticalAlign="bottom" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </NeuralCard>
            </div>

            <NeuralCard className="lg:col-span-2" delay={0.3}>
                <div className="flex items-center gap-3 mb-6">
                    <Activity size={20} className="text-emerald-400" />
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Strategic Audit Log</h4>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between group hover:border-[var(--brand-blue)]/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-sm text-[var(--text-primary)]">System Integrity Scan</p>
                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Completed Today, 10:00 AM</p>
                            </div>
                        </div>
                        <NeuralBadge variant="success">Healthy</NeuralBadge>
                    </div>
                    <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between group hover:border-[var(--brand-blue)]/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                <TrendingUp size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-sm text-[var(--text-primary)]">Market Trend Analysis</p>
                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Optimized Asset Flow Predicted</p>
                            </div>
                        </div>
                        <ChevronRight className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" size={20} />
                    </div>
                </div>
            </NeuralCard>
        </div>
    );
};

export default Reports;
