import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QA App - by <a href='https://github.com/mmar58'>mmar58</a></IonTitle>
          
        </IonToolbar>
        <IonTitle>Homepage</IonTitle>
      </IonHeader>
      <IonContent className="flex items-center justify-center h-full" fullscreen>
                <div className="flex flex-col space-y-4">
                    <IonButton className='homeButton' expand="block" routerLink="/addquiz">Add Question</IonButton>
                    <IonButton className='homeButton' expand="block" routerLink="/quiz">Take Quiz</IonButton>
                    <IonButton className='homeButton' expand="block" routerLink="/page3">Take Custom Quiz</IonButton>
                </div>
            </IonContent>
    </IonPage>
  );
};

export default Home;
