import React, { useEffect, useState } from 'react';
import { 
    IonPage, IonContent, IonButton, IonLabel, IonInput, IonItem 
} from '@ionic/react';
import storage from '../storage';
import { sectionsKey } from '../keys';
import type { Question, Section } from '../types';

const QUESTIONS_PER_PAGE = 3; // Number of questions per page

const Quiz: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [numQuestions, setNumQuestions] = useState<number>(5);
    const [timeLimit, setTimeLimit] = useState<number>(60);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(timeLimit);

    useEffect(() => {
        const loadSections = async () => {
            const storedSections = await storage.get(sectionsKey);
            if (storedSections) {
                setSections(storedSections.sections);
            }
        };
        loadSections();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (quizStarted && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setQuizFinished(true);
            setQuizStarted(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [quizStarted, timer]);

    const handleSectionSelection = (id: string) => {
        setSelectedSections((prev) => 
            prev.includes(id) ? prev.filter((sec) => sec !== id) : [...prev, id]
        );
    };

    const startQuiz = async () => {
        if (selectedSections.length === 0 || numQuestions <= 0) {
            alert("Please select at least one section and a valid number of questions.");
            return;
        }

        let allQuestions: Question[] = [];
        for (const sec of selectedSections) {
            const questions = await storage.get(sec + "_Q") || [];
            allQuestions = [...allQuestions, ...questions];
        }

        if (allQuestions.length === 0) {
            alert("No questions available in the selected sections.");
            return;
        }

        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
        setQuizQuestions(shuffledQuestions.slice(0, numQuestions));
        setCurrentPage(0);
        setSelectedAnswers({});
        setScore(0);
        setTimer(timeLimit);
        setQuizStarted(true);
        setQuizFinished(false);
    };

    const handleSubmitQuiz = () => {
        let calculatedScore = 0;
        quizQuestions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                calculatedScore += 1;
            }
        });
        setScore(calculatedScore);
        setQuizFinished(true);
        setQuizStarted(false);
    };

    const totalPages = Math.ceil(quizQuestions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const paginatedQuestions = quizQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

    return (
        <IonPage>
            <IonContent style={{ padding: '24px', backgroundColor: '#121212', color: '#fff' }}>
            {!quizStarted && !quizFinished ? (
                    <>
                        <h2>Select Sections</h2>

                        {/* Sections Selection UI */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    onClick={() => handleSectionSelection(section.id)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        backgroundColor: selectedSections.includes(section.id) ? '#007BFF' : '#E0E0E0',
                                        color: selectedSections.includes(section.id) ? '#FFFFFF' : '#000000',
                                    }}
                                >
                                    {section.name}
                                </div>
                            ))}
                        </div>

                        {/* Question Count & Time Limit */}
                        <IonItem>
                            <IonLabel>Number of Questions</IonLabel>
                            <IonInput type="number" value={numQuestions} onIonChange={(e) => setNumQuestions(Number(e.detail.value))} />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Time Limit (Seconds)</IonLabel>
                            <IonInput type="number" value={timeLimit} onIonChange={(e) => setTimeLimit(Number(e.detail.value))} />
                        </IonItem>

                        <IonButton expand="block" onClick={startQuiz}>
                            START QUIZ
                        </IonButton>
                    </>
                ) : quizStarted ? (
                    <>
                        <h2>Quiz in Progress</h2>
                        <p>Time Remaining: {timer}s</p>

                        {paginatedQuestions.map((question, index) => {
                            const globalIndex = startIndex + index;
                            return (
                                <div key={globalIndex} style={{ marginBottom: '15px' }}>
                                    <h3>{question.question}</h3>
                                    {question.options.map((option, optionIndex) => (
                                        <div
                                            key={optionIndex}
                                            onClick={() => setSelectedAnswers((prev) => ({
                                                ...prev,
                                                [globalIndex]: optionIndex
                                            }))}
                                            style={{
                                                padding: '10px',
                                                marginTop: '8px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedAnswers[globalIndex] === optionIndex ? '#007BFF' : '#1E1E1E',
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}

                        <IonButton expand="block" style={{ marginTop: '20px' }} onClick={handleSubmitQuiz}>
                            Submit Quiz
                        </IonButton>
                    </>
                ) : (
                    <>
                        <h2>Your Score: {score} / {quizQuestions.length}</h2>

                        {paginatedQuestions.map((question, index) => {
                            const globalIndex = startIndex + index;
                            return (
                                <div key={globalIndex} style={{ marginBottom: '15px' }}>
                                    <h3>{question.question}</h3>
                                    {question.options.map((option, optionIndex) => {
                                        const isSelected = selectedAnswers[globalIndex] === optionIndex;
                                        const isCorrect = optionIndex === question.correctAnswer;

                                        let bgColor = "#1E1E1E"; // Default
                                        if (isSelected) {
                                            bgColor = isCorrect ? "#00C851" : "#FF4444"; // Green if correct, Red if wrong
                                        } else if (!isSelected && isCorrect) {
                                            bgColor = "#007BFF"; // Blue if correct but not selected
                                        }

                                        return (
                                            <div
                                                key={optionIndex}
                                                style={{
                                                    padding: '10px',
                                                    marginTop: '8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: bgColor,
                                                    color: '#FFFFFF'
                                                }}
                                            >
                                                {option}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {/* Pagination Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <IonButton disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
                                Previous
                            </IonButton>
                            <IonButton disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>
                                Next
                            </IonButton>
                        </div>

                        {/* Restart & New Quiz Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <IonButton onClick={() => setQuizFinished(false)} style={{ flex: 1, marginRight: '10px' }}>
                                Restart Quiz
                            </IonButton>
                            <IonButton onClick={() => { setQuizFinished(false); setSelectedSections([]); }} style={{ flex: 1 }}>
                                Take New Quiz
                            </IonButton>
                        </div>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Quiz;
