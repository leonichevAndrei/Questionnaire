import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { SPECIAL_VAL } from "../../settings/app-settings";
import { QuestSubmit, QuestSubmitButton, QuestionsWrap, SubmitButton } from "../../styled-components/common";
import { AnswersListType, QuestionnaireType } from "../../types/common";
import generateAnswers from "../../utills/generate-answers";
import PopupFinish from "../popup/popup-finish";
import PopupStart from "../popup/popup-start";
import Question from "./question";

export default function Questions(props: { setUserName: React.Dispatch<React.SetStateAction<string>> }) {

    const { questionnaireId } = useParams();
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireType | undefined>(undefined);
    const [answersList, setAnswersList] = useState<AnswersListType | undefined>(undefined);
    const [errors, setErrors] = useState(new Array());
    const [name, setName] = useState("");
    const [popupStartVisible, setPopupStartVisible] = useState(true);
    const [popupFinishVisible, setPopupFinishVisible] = useState(false);

    // Fetch current questionnaire from DB by id and create empty 
    // answers object based on fetch result (current questionnaire)
    useEffect(() => {
        fetch(`http://localhost:3001/questionnaires/${questionnaireId}`)
            .then(response => response.json())
            .then(result => {
                setAnswersList(generateAnswers(result))
                setQuestionnaire(result)
            });
    }, [questionnaireId]);

    function handleSubmit() {
        // Error handling on submit event
        const errorsArray = new Array();
        for (let i = 0; i < answersList!.length; i++) {
            errorsArray[i] = (
                (answersList![i].answer === "") ||
                (answersList![i].answer === SPECIAL_VAL)
            ) && questionnaire!.questions[i].required === true;
        }
        JSON.stringify(errorsArray) !== JSON.stringify(errors)
            && setErrors(errorsArray);
        // If we have no errors, add the answers to the database 
        // and open the final popup
        if (errorsArray.indexOf(true) === -1) {
            fetch(`http://localhost:3001/answers`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    questionnaire: questionnaire!.id,
                    answers: answersList!
                })
            }).then(() => {
                setPopupFinishVisible(true);
            });
        }
    }
    // When we start a new test, set the received username 
    // and hide the final popup if it is visible
    function handleStart() {
        props.setUserName(name);
        popupFinishVisible && setPopupFinishVisible(false);
    }
    // When we pressing button "Try again" in final popup
    // we need to toggle popups to the initial popup, refresh 
    // answers list, clear all errors and username
    function handleFinish() {
        setPopupFinishVisible(false);
        setPopupStartVisible(true);
        setAnswersList(generateAnswers(questionnaire!));
        setErrors(new Array());
        setName("");
    }

    return (
        <QuestionsWrap>
            {questionnaire !== undefined && answersList !== undefined &&
                questionnaire.questions.map((question, ind) => {
                    return (
                        <Question
                            key={ind}
                            question={question}
                            answersList={answersList}
                            setAnswersList={setAnswersList}
                            error={errors[ind]}
                            name={name}
                        />);
                })}
            <QuestSubmit>
                <QuestSubmitButton>
                    <SubmitButton onClick={() => handleSubmit()}>Submit</SubmitButton>
                </QuestSubmitButton>
            </QuestSubmit>
            <PopupStart
                name={name}
                setName={setName}
                popupStartVisible={popupStartVisible}
                setPopupStartVisible={setPopupStartVisible}
                handleStart={handleStart}
            />
            <PopupFinish
                popupFinishVisible={popupFinishVisible}
                handleFinish={handleFinish}
            />
        </QuestionsWrap>
    )
}