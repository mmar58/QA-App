export interface MainData{
    answerKeys:string,
    lastQuestionCount:number,
}

export interface Section {
    id: string;
    name: string;
}

export interface SectionData{
    sections:Section[],
    lastSection:string
}
export interface Question {
    question:string,
    options:string[],
    correctAnswer:number
}