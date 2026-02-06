import { create } from 'zustand';

export const useGameStore = create((set) => ({
    userId: '',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answers: [], // Stores { questionId, answer, isCorrect }
    gameState: 'start', // 'start' | 'playing' | 'result'

    setUserId: (id) => set({ userId: id }),

    startGame: (questions) => set({
        questions,
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        gameState: 'playing'
    }),

    answerQuestion: (isCorrect, answer) => set((state) => {
        const newScore = isCorrect ? state.score + 1 : state.score;
        const newAnswers = [...state.answers, {
            qIndex: state.currentQuestionIndex,
            answer,
            isCorrect
        }];

        // Check if last question
        if (state.currentQuestionIndex >= state.questions.length - 1) {
            return {
                score: newScore,
                answers: newAnswers,
                gameState: 'result'
            };
        }

        return {
            score: newScore,
            answers: newAnswers,
            currentQuestionIndex: state.currentQuestionIndex + 1
        };
    }),

    resetGame: () => set({
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        gameState: 'start'
    }),
}));
