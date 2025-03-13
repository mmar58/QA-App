// PopupNotice.tsx
import { useState, useImperativeHandle, forwardRef } from 'react';
import { IonToast } from '@ionic/react';
import "./PopupNotice.css"
type PopupNoticeProps = {
  duration?: number;
};

export type PopupNoticeRef = {
  showNotice: (message: string, type:'success'|'warning'|'error'|"general") => void;
};

const PopupNotice = forwardRef<PopupNoticeRef, PopupNoticeProps>(
  ({ duration = 2000 }, ref) => {
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

    useImperativeHandle(ref, () => ({
      showNotice(message: string,type:'success'|'warning'|'error'|"general"='general') {
        setMessage(message);
        setShowToast(true);
        setType(type);
      }
    }));

    return (
      <>
        <IonToast
          isOpen={showToast}
          message={message}
          duration={duration}
          style={{ '--toast-color': type === 'success' ? 'green' : type === 'warning' ? 'yellow' : type === 'error' ? 'red' : 'black' }}
          color={type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'light'}
          position='middle'
          onDidDismiss={() => setShowToast(false)}
        />
      </>
    );
  }
);

export default PopupNotice;
