import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonPage, IonContent, IonCheckbox, IonModal } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import storage from '../storage';
import { mainDataKey, sectionsKey} from '../keys';
import PopupNotice, { PopupNoticeRef } from '../components/PopupNotice';
import type {Section,SectionData} from '../types'



const AddQuiz: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [sections, setSections] = useState<Section[]>([
        { id: 'section1', name: 'Section 1' },
        { id: 'section2', name: 'Section 2' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
    const [newSection, setNewSection] = useState(''); // New state for section input
    const popupRef = useRef<PopupNoticeRef>(null);
    const history = useHistory();

    let curSection:SectionData;
    const loadSections= async () => {
        curSection=await storage.get(sectionsKey);
        if(curSection){
            setSections(curSection.sections);
            setSelectedSection(curSection.lastSection);
        }
        else{
            setSections([{id:"First Section",name:"section0"}]);
            setSelectedSection("section0");
            curSection={sections:[{id:"section0",name:"First Section"}],lastSection:"section0"};
            await storage.set(sectionsKey,curSection);
        }
    }

    useEffect(() => {
        loadSections(); // Load sections when the component mounts
    },[])


    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        if (!question.trim() || options.some(opt => opt.trim() === '') || correctAnswer === null) {
            popupRef.current?.showNotice('Please fill in all fields and select a correct answer.', 'warning');
            return;
        }

        const quizData = { question, options, correctAnswer, section: selectedSection };
        console.log('Quiz Data:', quizData);
        popupRef.current?.showNotice('Quiz submitted successfully!', 'success');
    };

    const handleCancel = () => {
        history.goBack();
    };

    const handleAddSection = async() => {
        if (!newSection.trim()) {
            popupRef.current?.showNotice('Section name cannot be empty.', 'warning');
            return;
        }
        
        const newSectionObj = { id: `section${sections.length + 1}`, name: newSection };
        if(!curSection){
            await loadSections();
        }
        curSection.sections.push(newSectionObj);
        setSections(curSection.sections);
        // Saving the sections
        storage.set(sectionsKey,curSection);
        // Clearing the input field
        setNewSection('');
        // popupRef.current?.showNotice('Section added successfully!', 'success');
    };

    return (
        <IonPage>
            <IonContent className="p-4">
                <IonItem button onClick={() => setShowModal(true)}>
                    <IonLabel>{selectedSection ? sections.find(sec => sec.id === selectedSection)?.name : "Select a section"}</IonLabel>
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Question</IonLabel>
                    <IonInput value={question} onIonChange={(e) => setQuestion(e.detail.value || '')} placeholder="Enter your question" />
                </IonItem>

                {/* Section Selection Modal */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonContent>
                        <h2 className="p-4">Select or Add a Section</h2>
                        
                        {sections.map((section) => (
                            <IonItem key={section.id} button onClick={() => { setSelectedSection(section.id); setShowModal(false); }}>
                                <IonLabel>{section.name}</IonLabel>
                            </IonItem>
                        ))}

                        {/* Input for Adding a New Section */}
                        <IonItem>
                            <IonLabel position="stacked">New Section Name</IonLabel>
                            <IonInput value={newSection} onIonChange={(e) => setNewSection(e.detail.value || '')} placeholder="Enter new section name" />
                        </IonItem>

                        {/* Add Section Button */}
                        <IonButton expand="block" className="m-2" onClick={handleAddSection}>
                            Add Section
                        </IonButton>

                        {/* Close Modal Button */}
                        <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
                            Close
                        </IonButton>
                    </IonContent>
                </IonModal>

                {/* Options List */}
                {options.map((option, index) => (
                    <IonItem key={index} className="flex items-center space-x-2">
                        <IonLabel position="stacked">Option {index + 1}</IonLabel>
                        <IonInput
                            value={option}
                            onIonChange={(e) => handleOptionChange(index, e.detail.value || '')}
                            placeholder={`Enter option ${index + 1}`}
                        />
                        <IonCheckbox
                            checked={correctAnswer === index}
                            onIonChange={() => setCorrectAnswer(index)}
                        />
                    </IonItem>
                ))}

                {/* Submit & Cancel Buttons */}
                <div className="flex space-x-4 mt-4">
                    <IonButton expand="block" onClick={handleSubmit}>
                        Submit Quiz
                    </IonButton>
                    <IonButton expand="block" color="danger" onClick={handleCancel}>
                        Cancel
                    </IonButton>
                </div>

                <PopupNotice ref={popupRef} duration={1000} />
            </IonContent>
        </IonPage>
    );
};

export default AddQuiz;
