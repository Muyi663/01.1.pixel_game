import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

const Result = () => {
    const navigate = useNavigate();
    const { score, questions, answers, resetGame } = useGameStore();
    const [showReview, setShowReview] = React.useState(false);

    // If no answers (direct access), redirect home
    if (!questions || questions.length === 0) {
        React.useEffect(() => { navigate('/'); }, [navigate]);
        return null;
    }

    const handleRetry = () => {
        resetGame();
        navigate('/game');
    };

    const handleHome = () => {
        resetGame();
        navigate('/');
    };

    const passThreshold = import.meta.env.VITE_PASS_THRESHOLD || 3;
    const passed = score >= passThreshold;

    return (
        <div className="pixel-box" style={{ maxWidth: '800px' }}>
            <h1 className="pixel-font" style={{ fontSize: '3rem', color: passed ? 'var(--pixel-success)' : 'var(--pixel-error)' }}>
                {passed ? '挑战成功' : '挑战失败'}
            </h1>

            <div style={{ margin: '40px 0', fontSize: '1.5rem' }}>
                <p>得分: <span style={{ color: 'var(--pixel-accent)' }}>{score}</span> / {questions.length}</p>
                <p style={{ fontSize: '1rem', color: '#aaa' }}>通关门槛: {passThreshold}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                <button className="pixel-btn review-btn" onClick={() => setShowReview(!showReview)}>
                    {showReview ? 'HIDE REVIEW' : 'REVIEW MISTAKES'}
                </button>

                {showReview && (
                    <div className="review-container">
                        {questions.map((q, idx) => {
                            // Find user answer
                            const userAnswerObj = answers.find(a => a.qIndex === idx);
                            const userAns = userAnswerObj ? userAnswerObj.answer : 'NO ANSWER';
                            const isCorrect = userAnswerObj ? userAnswerObj.isCorrect : false;

                            // Only show if wrong? Or show all? User said: "能够用红色标记出错了的题目并给出正确答案"
                            // Usually reviews show all but highlight errors. Let's show all for context.
                            // IF specific requirement "mark wrong questions in red", we do that.

                            return (
                                <div key={idx} className={`review-card ${isCorrect ? 'correct' : 'wrong'}`}>
                                    <div className="review-question">
                                        Q{idx + 1}: {q.question}
                                    </div>

                                    <div className="review-answer your-answer">
                                        YOUR ANSWER: <span className={!isCorrect ? 'wrong-text' : ''}>{userAns}</span>
                                    </div>

                                    {!isCorrect && (
                                        <div className="review-answer correct-answer">
                                            CORRECT ANSWER: {q.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button className="pixel-btn" onClick={handleRetry}>
                        CONTINUE?
                    </button>
                    <button className="pixel-btn" style={{ backgroundColor: '#666' }} onClick={handleHome}>
                        QUIT GAME
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Result;
