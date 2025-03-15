import React from 'react';
import { Question } from '../../types';

interface QuizQuestionProps {
    question: Question;
    index: number;
    selectedAnswers: { [key: number]: number | null };
    setSelectedAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: number | null }>>;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, index, selectedAnswers, setSelectedAnswers }) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <h3>{question.question}</h3>
            {question.options.map((option, optionIndex) => (
                <div
                    key={optionIndex}
                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [index]: optionIndex }))}
                    style={{
                        padding: '10px',
                        marginTop: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: selectedAnswers[index] === optionIndex ? '#007BFF' : '#1E1E1E',
                        color: '#FFFFFF'
                    }}
                >
                    {option}
                </div>
            ))}
        </div>
    );
};
export default QuizQuestion;
