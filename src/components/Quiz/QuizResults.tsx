import React from 'react';
import { IonButton } from '@ionic/react';
import { Question } from '../../types';

interface QuizResultsProps {
    quizQuestions: Question[];
    selectedAnswers: { [key: number]: number | null };
    score: number;
    setQuizFinished: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quizQuestions, selectedAnswers, score, setQuizFinished }) => {
    return (
        <>
            <h2>Your Score: {score} / {quizQuestions.length}</h2>

            {quizQuestions.map((question, index) => (
                <div key={index} style={{ marginBottom: '15px', padding: '10px', borderBottom: '2px solid #444' }}>
                    <h3>{question.question}</h3>

                    {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswers[index] === optionIndex;
                        const isCorrect = optionIndex === question.correctAnswer;
                        const isWrongSelection = isSelected && !isCorrect;

                        // Background color logic
                        let bgColor = "#1E1E1E"; // Default gray
                        if (isSelected && isCorrect) {
                            bgColor = "#00C851"; // Green for correct answer selected by user
                        } else if (!isSelected && isCorrect) {
                            bgColor = "#007BFF"; // Blue for correct answer not selected by user
                        } else if (isWrongSelection) {
                            bgColor = "#FF4444"; // Red for wrong answer selected by user
                        }

                        return (
                            <div key={optionIndex} style={{
                                padding: '10px',
                                marginTop: '8px',
                                borderRadius: '6px',
                                backgroundColor: bgColor,
                                color: '#FFFFFF',
                                fontWeight: isCorrect ? "bold" : "normal",
                                textDecoration: isWrongSelection ? "line-through" : "none"
                            }}>
                                {option}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Restart Quiz Button Only */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <IonButton onClick={() => setQuizFinished(false)} expand="block">
                    Restart Quiz
                </IonButton>
            </div>
        </>
    );
};

export default QuizResults;
