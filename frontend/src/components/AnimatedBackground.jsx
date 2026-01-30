import React from 'react';
import './solar.css'; // Import specific CSS for this complex animation

const AnimatedBackground = () => {
    // Generate Stars
    const stars = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        opacity: Math.random()
    }));

    return (
        <div className="solar-system-container">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: star.left,
                        top: star.top,
                        animationDelay: star.animationDelay,
                        opacity: star.opacity
                    }}
                />
            ))}

            <div className="sun"></div>

            {/* Mercury */}
            <div className="orbit orbit-mercury">
                <div className="planet planet-mercury"></div>
            </div>

            {/* Venus */}
            <div className="orbit orbit-venus">
                <div className="planet planet-venus"></div>
            </div>

            {/* Earth + Moon */}
            <div className="orbit orbit-earth">
                <div className="planet-container planet-earth-container">
                    <div className="planet planet-earth">
                        <div className="orbit orbit-moon">
                            <div className="planet planet-moon"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mars */}
            <div className="orbit orbit-mars">
                <div className="planet planet-mars"></div>
            </div>

            {/* Jupiter */}
            <div className="orbit orbit-jupiter">
                <div className="planet planet-jupiter"></div>
            </div>

            {/* Saturn */}
            <div className="orbit orbit-saturn">
                <div className="planet planet-saturn">
                    <div className="saturn-rings"></div>
                </div>
            </div>

            {/* Uranus */}
            <div className="orbit orbit-uranus">
                <div className="planet planet-uranus"></div>
            </div>

            {/* Neptune */}
            <div className="orbit orbit-neptune">
                <div className="planet planet-neptune"></div>
            </div>

            {/* Pluto (Optional, kept it tiny) */}
            <div className="orbit orbit-pluto">
                <div className="planet planet-pluto"></div>
            </div>
        </div>
    );
};

export default AnimatedBackground;
