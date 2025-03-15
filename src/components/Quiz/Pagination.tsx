import React from 'react';
import { IonButton } from '@ionic/react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <IonButton disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
            </IonButton>
            <IonButton disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>
                Next
            </IonButton>
        </div>
    );
};

export default Pagination;
