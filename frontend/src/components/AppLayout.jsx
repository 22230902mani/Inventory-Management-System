import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { RefreshCw } from 'lucide-react';

const AppLayout = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const location = useLocation();

    // Pull to refresh functionality
    const handleTouchStart = (e) => {
        if (window.scrollY === 0) {
            setTouchStart(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e) => {
        if (touchStart > 0) {
            const currentTouch = e.touches[0].clientY;
            const distance = currentTouch - touchStart;

            if (distance > 0 && distance < 150) {
                setPullDistance(distance);
            }
        }
    };

    const handleTouchEnd = () => {
        if (pullDistance > 80) {
            setRefreshing(true);
            // Trigger page refresh/reload
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        setPullDistance(0);
        setTouchStart(0);
    };

    // Reset pull distance when changing routes
    useEffect(() => {
        setPullDistance(0);
        setRefreshing(false);
    }, [location]);

    return (
        <div
            className="flex h-screen overflow-hidden no-overflow bg-[var(--bg-primary)]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden no-overflow">
                {/* Header - Hidden on Mobile */}
                <div className="hidden lg:block">
                    <Header />
                </div>

                {/* Pull to Refresh Indicator */}
                {pullDistance > 0 && (
                    <div
                        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 transition-opacity"
                        style={{
                            opacity: Math.min(pullDistance / 80, 1),
                            transform: `translateY(${Math.min(pullDistance - 40, 60)}px)`
                        }}
                    >
                        <div className="bg-brand-blue text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <RefreshCw
                                size={16}
                                className={refreshing || pullDistance > 80 ? 'animate-spin' : ''}
                                style={{
                                    transform: `rotate(${pullDistance * 2}deg)`
                                }}
                            />
                            <span className="text-sm font-bold">
                                {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden no-overflow swipeable safe-area-top">
                    <div className="min-h-full">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden safe-area-bottom">
                    <BottomNav />
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
