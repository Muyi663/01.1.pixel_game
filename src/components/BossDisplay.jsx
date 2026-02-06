import React, { useMemo } from 'react';

const BossDisplay = ({ seed, level }) => {
    // Use DiceBear Pixel Art API
    // seed can be based on level to ensure deterministic boss per level
    const imageUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed || level}`;
    }, [seed, level]);

    return (
        <div className="boss-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
                width: '150px',
                height: '150px',
                margin: '0 auto',
                border: '4px solid white',
                backgroundColor: '#444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.5)'
            }}>
                <img
                    src={imageUrl}
                    alt="Quest Boss"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
                />
            </div>
            <h3 style={{ marginTop: '10px', color: '#ff5555' }}>QUEST {level}</h3>
        </div>
    );
};

export default BossDisplay;
