import { QuestionType, AnswersType } from "./common"

export type QuestionProps = {
    question: QuestionType,
    answers: AnswersType | undefined,
    setAnswers: React.Dispatch<React.SetStateAction<AnswersType | undefined>>,
    error: boolean
}
export type AnswerComponentProps = {
    propsCombine: {
        answerGetById: number[],
        question: QuestionType,
        answers: AnswersType | undefined,
        setAnswers: React.Dispatch<React.SetStateAction<AnswersType | undefined>>,
        other?: boolean | undefined
    }
}
export type AnswerComponentTextProps = {
    propsCombine: {
        value: string,
        handleUpdate: (e: React.FormEvent<HTMLInputElement>) => void
    }
}
export type AnswerComponentSelectProps = {
    propsCombine: {
        other: boolean | undefined,
        question: QuestionType,
        handleUpdate: (e: React.FormEvent<HTMLInputElement>) => void
    }
}
export type PopupStartProps = {
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    popupVisible: boolean,
    setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>,
    handleStart: () => void
}
export type PopupDialogProps = {
    show: boolean,
    children: React.ReactNode
}