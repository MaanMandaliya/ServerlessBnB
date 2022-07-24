import { React } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Questionnare() {
  const [randomQuestion, setRandomQuestion] = useState("");
  let navigate = useNavigate();
  let stopApiCall = false;
  useEffect(() => {
    if (!stopApiCall) {
      stopApiCall = true;
      fetch(
        "https://lvwrtsyehooybptx3kusp7uxle0grarp.lambda-url.us-east-1.on.aws/questionnaire/getQuestionList?username="+localStorage.getItem("username")) // call lambda to get all question list
        .then((response) => {
          return response.json();
        })
        .then((resJson) => {
          console.log(resJson);
          setRandomQuestion(resJson.question);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const [questionnaireForm, setValues] = useState({
    answer: "",
  });

  const handleFormValueChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...questionnaireForm, [name]: value });
    console.log(questionnaireForm);
  };

  const handleQuestionnaireForm = (event) => {
    event.preventDefault();
    if (questionnaireForm["answer"] == "") {
      alert("Please enter answer");
      return;
    }

    let obj = {
      [randomQuestion]: questionnaireForm.answer,
      username: localStorage.getItem("username"),
    };
    // console.log(JSON.stringify(obj) + " JJJJJ ");

    axios
      .post(
        "https://lvwrtsyehooybptx3kusp7uxle0grarp.lambda-url.us-east-1.on.aws/questionnaire/validateAnswers",
        obj
      ) // call aws lmabda function to validate answers
      .then((response) => {
        console.log(response.data);
        navigate("../caesarcipher");
      })
      .catch((erroe) => {
        console.log(erroe + " questionnaire response");
        alert("Answer did not match");
      });
  };

  return (
    <form onSubmit={handleQuestionnaireForm}>
      <div className="form-body">
        <div>
          <label>{randomQuestion || "Loading..."}</label>
          <input
            type="text"
            value={questionnaireForm["answer"]}
            name="answer"
            onChange={handleFormValueChange}
          ></input>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default Questionnare;
