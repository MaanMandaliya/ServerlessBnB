import { React } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Registration() {
  const [registrationForm, setValues] = useState({
    full_name: "",
    email: "",
    password: "",
    secret_key: "",
    question_1: "What's your birth city?",
    question_2: "What's your favourite number?",
    question_3: "What was your first vehicle?",
    answer_1: "",
    answer_2: "",
    answer_3: "",
  });

  const question_1 = "What's your birth city?";
  const question_2 = "What's your favourite number?";
  const question_3 = "What was your first vehicle?";

  let navigate = useNavigate();

  const handleFormValueChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...registrationForm, [name]: value });
  };

  const handleRegisterForm = (event) => {
    event.preventDefault();
    console.log(registrationForm);
    if (!formValidation()) {
      alert("Invalid details");
      return;
    }

    axios
      .post(
        "https://iuaqxkdayszxzzht6fj3lj726i0djxey.lambda-url.us-east-1.on.aws/register",
        registrationForm
      ) // call aws lmabda function to validate answers
      .then((response) => {
        console.log(response.data);
        alert("Registration Success");
        navigate("../login");
      })
      .catch((erroe) => {
        console.log(erroe + " Resitration failed response");
        alert("Registration Failed");
      });
  };

  const formValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let isvalid = true;

    if (!registrationForm.full_name) {
      isvalid = false;
    }

    if (!registrationForm.email) {
      isvalid = false;
    } else if (!emailRegex.test(registrationForm.email)) {
      isvalid = false;
    }

    if (!registrationForm.password) {
      isvalid = false;
    } else if (!passwordRegex.test(registrationForm.password)) {
      isvalid = false;
    }

    return isvalid;
  };

  return (
    <form onSubmit={handleRegisterForm}>
      <div className="r-form-body">
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={registrationForm.full_name}
            name="full_name"
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={registrationForm.email}
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={registrationForm.password}
            name="password"
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>Secret Key</label>
          <input
            type="password"
            value={registrationForm.secret_key}
            name="secret_key"
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>{question_1}</label>
          <input
            type="text"
            name="answer_1"
            value={registrationForm.answer_1}
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>{question_2}</label>
          <input
            type="text"
            name="answer_2"
            value={registrationForm.answer_2}
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>{question_3}</label>
          <input
            type="text"
            name="answer_3"
            value={registrationForm.answer_3}
            onChange={handleFormValueChange}
          ></input>
        </div>
        <button type="submit">Submit</button>
        <div>
          <label>Have an account?</label>
          <a
            style={{ paddingLeft: "14px", textDecoration: "none" }}
            href="/login"
          >
            {" "}
            Login!
          </a>
        </div>
      </div>
    </form>
  );
}

export default Registration;
