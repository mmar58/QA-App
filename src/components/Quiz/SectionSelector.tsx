import React from 'react';
import { Section } from '../../types';

interface SectionSelectorProps {
    sections: Section[];
    selectedSections: string[];
    setSelectedSections: React.Dispatch<React.SetStateAction<string[]>>;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({ sections, selectedSections, setSelectedSections }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {sections.map((section) => (
                <div
                    key={section.id}
                    onClick={() => setSelectedSections(prev =>
                        prev.includes(section.id) ? prev.filter(sec => sec !== section.id) : [...prev, section.id]
                    )}
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
    );
};
export default SectionSelector;
