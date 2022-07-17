import {React} from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Questionnare(){

    const [questionsList, setQuestionList] = useState([]);
    const [randomNum, setRandomNum] = useState(2);
    const [randomQuestion, setRandomQuestion] = useState("");
    let navigate = useNavigate();
    let stopApiCall=false;
    useEffect(() => {
        
        // logic to randomly generate question NUm

        //setRandomNum(getQuestionNumber());
        //console.log(randomNum+ " ffff");
       //setQuestionList([{question_1:"what is your name?"},{question_2:"How old are you?"},{question_3:"Are you good?"}]);
        //fetch('https://lvwrtsyehooybptx3kusp7uxle0grarp.lambda-url.us-east-1.on.aws/questionnaire/getQuestionList?'+localStorage.getItem("username"))  // call lambda to get all question list
        if(!stopApiCall){
            stopApiCall=true;
            fetch('https://vcppt3bosrxwgftlco224dgsuy0fnhvd.lambda-url.us-east-1.on.aws/questionnaire/getQuestionList?username=anita.mishra2106@gmail.com') // call lambda to get all question list
            .then(response =>{
                return response.json();
            }).then(resJson => {
                console.log(resJson);
                setRandomQuestion(resJson.question);
                //setQuestionList(resJson); // here array is not set
                //setRandomQuestion(questionsList[randomNum-1]['question_'+randomNum]);// here highlighted is throwing undefined. trying to access undefined 'question_1'
            })
            .catch(err => {
                console.log(err);
            })
        }
        
    }, []);

    const getQuestionNumber = ()=> {
        const maxValue = 3;
        const minValue = 1;
        return Math.floor(
            Math.random() * (maxValue - minValue + 1) + minValue
        )
    }

    const [questionnaireForm, setValues] = useState({
        answer:''
    });



    const handleFormValueChange = (event) => {
        const { name, value } = event.target;
       // console.log("Hello value ");
        //console.log(name);
        setValues({ ...questionnaireForm, [name]: value });
        console.log(questionnaireForm);
    };

    const handleQuestionnaireForm = (event) => {
        event.preventDefault();
        if(questionnaireForm['answer'] == ''){
            alert('Please enter answer');
            return;
        }

        let obj={
            [randomQuestion]:questionnaireForm.answer,
            "username":"anita.mishra2106@gmail.com"
        }
        console.log(JSON.stringify(obj)+ " JJJJJ ");
        const requestBody = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: obj
        };

        fetch('https://vcppt3bosrxwgftlco224dgsuy0fnhvd.lambda-url.us-east-1.on.aws/questionnaire/validateAnswers', requestBody)  // call aws lmabda function to validate answers
            .then(response => {
                console.log(response.data)
                navigate("../caesarcipher");
                
            })
            .catch(erroe => {
                console.log(erroe + " questionnaire response");
                alert("Answer did not match");
            });
    }


    return(
        <form onSubmit={handleQuestionnaireForm}>
            
            <div className="form-body">
                <div >
                    <label>{randomQuestion}</label>
                    <input type="text" value={questionnaireForm['answer']} name="answer" onChange={handleFormValueChange}></input>
                </div> 
            {/* {questionsList.map((ques,i) => (
                            <div key={i+1}>
                              <label>{ques['question_'+(i+1)]}</label>
                              <input type="text" value={questionnaireForm['answer_'+(i+1)]} name={'answer_'+(i+1)} onChange={handleFormValueChange}></input>
                            </div> 
                            ))} */}
               {/*  <div>
                    <label>Username</label>
                    <input type="text" value={questionnaireForm.email} name="email" onChange={handleFormValueChange}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={questionnaireForm.password} onChange={handleFormValueChange}></input>
                </div> */}
                {/* <button type="submit">Submit</button> */}
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

export default Questionnare



/* const qValidation=require('./questionnaire');
const aws = require('aws-sdk');

exports.handler = async (event) => {
    // TODO implement
    let response;
    
    let httpMethod = event['requestContext']['http']['method'];
    let path = event['requestContext']['http']['path'];
    let queryParams=event['queryStringParameters'];

    console.log("Params "+ queryParams.username);
    console.log(path);
    
    if(httpMethod=='POST'){
       let body = event['body'];
       if(path=='/questionnaire/validateAnswers'){
           const validateCheck=await qValidation.validateAnswers(body);
           //console.log( " Hjjjjjjj");
           if(validateCheck){
               response={
                statusCode: 200,
                body: true
            }
           }else{
               response={
                statusCode: 401,
                body: false
            }
           }
           
        }
    }
    if(httpMethod=='GET'){
         if(path=='/questionnaire/getQuestionList'){
           const quesList=await qValidation.getQuestionList(queryParams.username);
           console.log( " Hjjjjjjj");
           response={
                statusCode: 200,
                body: quesList
            };
        }
    }
    return response;
};
 */