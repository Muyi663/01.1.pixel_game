import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { fetchQuestions, submitScore } from '../services/api';
import BossDisplay from '../components/BossDisplay';
import clsx from 'clsx';

const Game = () => {
    const navigate = useNavigate();
    const {
        userId,
        questions,
        currentQuestionIndex,
        score,
        answers,
        startGame,
        answerQuestion,
        gameState
    } = useGameStore();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Initial Fetch
    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        const loadGame = async () => {
            setLoading(true);
            const questionCount = import.meta.env.VITE_QUESTION_COUNT || 5;
            const data = await fetchQuestions(questionCount);
            // Ensure data is array
            const qList = Array.isArray(data) ? data : [];
            startGame(qList);
            setLoading(false);
        };

        loadGame();
    }, [userId, navigate, startGame]);

    // Handle Game End
    useEffect(() => {
        if (gameState === 'result' && !submitting) {
            const finishGame = async () => {
                setSubmitting(true);
                // Submit answers to backend for final calculation (or just log them)
                // User asked for "backend calculates results". So we send answers.

                // Construct payload
                const payload = {
                    id: userId,
                    answers: answers
                };

                try {
                    // If backend calculates score, we might update local score from response.
                    // But our store already counts score locally for immediate feedback? 
                    // Prompt: "将作答结果传送到 Google Apps Script 计算成绩" 
                    // Implementation: We send answers, backend does logic. We can pass our local score too if needed.

                    await submitScore(payload);
                    navigate('/result');
                } catch (e) {
                    console.error(e);
                    navigate('/result'); // Go anyway
                }
            };

            finishGame();
        }
    }, [gameState, submitting, userId, answers, navigate]);

    const handleAnswer = (option) => {
        const currentQ = questions[currentQuestionIndex];
        // Check answer locally for immediate feedback/UI, though backend is final authority?
        // User: "将作答结果传送到 Google Apps Script 计算成绩" implies backend is authority.
        // But usually frontend needs to show "Correct/Wrong". 
        // Assuming 'currentQ' has 'answer' field (from our API mock/response).
        const isCorrect = option === currentQ.answer;
        answerQuestion(isCorrect, option);
    };

    if (loading) return <div className="pixel-font">LOADING...</div>;
    if (!questions.length) return <div className="pixel-font">NO QUESTIONS FOUND. <button onClick={() => navigate('/')}>RETURN</button></div>;
    if (gameState === 'result' || submitting) return <div className="pixel-font">CALCULATING SCORE...</div>;

    const currentQ = questions[currentQuestionIndex];

    return (
        <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="pixel-font" style={{ color: '#aaa' }}>玩家: {userId}</span>
                <span className="pixel-font" style={{ color: 'var(--pixel-accent)' }}>关卡 {currentQuestionIndex + 1}/{questions.length}</span>
            </div>

            <BossDisplay seed={`boss-${currentQuestionIndex}`} level={currentQuestionIndex + 1} />

            <div className="pixel-box" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', lineHeight: '1.4' }}>
                    {currentQ.question}
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {currentQ.options && currentQ.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className="pixel-btn"
                        onClick={() => handleAnswer(opt)}
                        style={{ fontSize: '1.2rem', margin: 0 }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Game;
