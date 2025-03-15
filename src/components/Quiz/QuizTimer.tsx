import React, { useEffect, useState } from 'react';

interface QuizTimerProps {
    timerRef: React.MutableRefObject<number>;
    setQuizFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setQuizStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ timerRef, setQuizFinished, setQuizStarted }) => {
    const [timeLeft, setTimeLeft] = useState<number>(timerRef.current);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        setQuizFinished(true);
                        setQuizStarted(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [timeLeft, setQuizFinished, setQuizStarted]);

    return (
        <h3 style={{ textAlign: 'center', color: 'red' }}>
            Time Remaining: {timeLeft}s
        </h3>
    );
};

export default QuizTimer;
