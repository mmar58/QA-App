import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { IonPage, IonContent, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonInput, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import storage from '../storage';
import { sectionsKey } from '../keys';
import { Question, Section } from '../types';
import SectionSelector from '../components/Quiz/SectionSelector';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizResults from '../components/Quiz/QuizResults';
import QuizTimer from '../components/Quiz/QuizTimer';
import Pagination from '../components/Quiz/Pagination';

const QUESTIONS_PER_PAGE = 3;

// Creating Context for Global Quiz State
const QuizContext = createContext(null);
const useQuiz = () => useContext(QuizContext);

const QuizProvider = ({ children }) => {
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
    const timerRef = useRef<number>(timeLimit);

    useEffect(() => {
        const loadSections = async () => {
            const storedSections = await storage.get(sectionsKey);
            if (storedSections) setSections(storedSections.sections);
        };
        loadSections();
    }, []);

    const startQuiz = async () => {
        if (selectedSections.length === 0 || numQuestions <= 0) {
            alert("Please select at least one section and a valid number of questions.");
            return;
        }

        let allQuestions: Question[] = [];
        for (const sec of selectedSections) {
            const questions: Question[] = (await storage.get(sec + "_Q")) || [];
            allQuestions = [...allQuestions, ...questions];
        }

        if (allQuestions.length === 0) {
            alert("No questions available in the selected sections.");
            return;
        }

        setQuizQuestions(allQuestions.sort(() => Math.random() - 0.5).slice(0, numQuestions));
        setCurrentPage(0);
        setSelectedAnswers({});
        setScore(0);
        timerRef.current = timeLimit;
        setQuizStarted(true);
        setQuizFinished(false);
    };

    const handleSubmitQuiz = () => {
        const calculatedScore = quizQuestions.reduce((acc, q, index) =>
            acc + (selectedAnswers[index] === q.correctAnswer ? 1 : 0), 0
        );
        setScore(calculatedScore);
        setQuizFinished(true);
        setQuizStarted(false);
    };

    return (
        <QuizContext.Provider value={{
            sections, selectedSections, setSelectedSections,
            numQuestions, setNumQuestions, timeLimit, setTimeLimit,
            quizStarted, setQuizStarted, quizFinished, setQuizFinished,
            quizQuestions, currentPage, setCurrentPage,
            selectedAnswers, setSelectedAnswers, score, handleSubmitQuiz,
            startQuiz, timerRef
        }}>
            {children}
        </QuizContext.Provider>
    );
};

const Quiz: React.FC = () => {
    return (
        <QuizProvider>
            <QuizContent />
        </QuizProvider>
    );
};

const QuizContent: React.FC = () => {
    const {
        sections, selectedSections, setSelectedSections,
        numQuestions, setNumQuestions, timeLimit, setTimeLimit,
        quizStarted, setQuizStarted, quizFinished, setQuizFinished,
        quizQuestions, currentPage, setCurrentPage,
        selectedAnswers, setSelectedAnswers, score, handleSubmitQuiz,
        startQuiz, timerRef
    } = useQuiz();

    const totalPages = Math.ceil(quizQuestions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const paginatedQuestions = quizQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Quiz</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent style={{ padding: '24px', backgroundColor: '#121212', color: '#fff' }}>
                {!quizStarted && !quizFinished ? (
                    <>
                        <h2>Select Sections</h2>
                        <SectionSelector sections={sections} selectedSections={selectedSections} setSelectedSections={setSelectedSections} />

                        <IonLabel>Number of Questions</IonLabel>
                        <IonInput type="number" value={numQuestions} onIonChange={(e) => setNumQuestions(parseInt(e.detail.value, 10) || 5)} />

                        <IonLabel>Quiz Duration (seconds)</IonLabel>
                        <IonInput type="number" value={timeLimit} onIonChange={(e) => setTimeLimit(parseInt(e.detail.value, 10) || 60)} />

                        <IonButton expand="block" onClick={startQuiz}>START QUIZ</IonButton>
                    </>
                ) : quizStarted ? (
                    <>
                        <QuizTimer timerRef={timerRef} setQuizFinished={setQuizFinished} setQuizStarted={setQuizStarted} />
                        {paginatedQuestions.map((q, idx) => (
                            <QuizQuestion key={idx} question={q} index={startIndex + idx} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
                        ))}
                        <p style={{ textAlign: 'center' }}>Page {currentPage + 1} of {totalPages}</p>
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                        <IonButton expand="block" style={{ marginTop: '20px' }} onClick={handleSubmitQuiz}>Submit Quiz</IonButton>
                    </>
                ) : (
                    <QuizResults quizQuestions={quizQuestions} selectedAnswers={selectedAnswers} score={score} setQuizFinished={setQuizFinished} />
                )}
            </IonContent>
        </IonPage>
    );
};

export default Quiz;
