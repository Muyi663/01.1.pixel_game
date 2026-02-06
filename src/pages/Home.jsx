import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

const Home = () => {
    const [inputBotId, setInputBotId] = useState('');
    const { setUserId } = useGameStore();
    const navigate = useNavigate();

    const handleStart = (e) => {
        e.preventDefault();
        if (!inputBotId.trim()) return;

        setUserId(inputBotId.trim());
        navigate('/game');
    };

    return (
        <div className="pixel-box">
            <h1 className="pixel-font" style={{ color: 'var(--pixel-accent)', marginBottom: '40px', fontSize: '3rem' }}>
                PIXEL QUIZ
                <div style={{ fontSize: '1rem', marginTop: '10px', color: '#fff' }}>ARCADE EDITION</div>
            </h1>

            <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <label style={{ fontSize: '1.2rem', color: '#aaa' }}>ENTER PLAYER ID</label>
                <input
                    type="text"
                    className="pixel-input"
                    value={inputBotId}
                    onChange={(e) => setInputBotId(e.target.value)}
                    placeholder="INSERT ID"
                    autoFocus
                />

                <button type="submit" className="pixel-btn" style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                    INSERT COIN (START)
                </button>
            </form>
        </div>
    );
};

export default Home;
