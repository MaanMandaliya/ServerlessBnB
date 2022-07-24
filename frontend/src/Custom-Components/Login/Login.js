import { React } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../../Config/Userpool";

function Login() {
  const [loginForm, setValues] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();

  const handleFormValueChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...loginForm, [name]: value });
  };

  const handleLoginForm = (event) => {
    event.preventDefault();
    if (loginForm.email == "" || loginForm.password == "") {
      alert("Please enter credentials");
      return;
    }
    const userToLogin = new CognitoUser({
      Username: loginForm.email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: loginForm.email,
      Password: loginForm.password,
    });

    userToLogin.authenticateUser(authDetails, {
      onSuccess: (data) => {
        //console.log("onSuccess:", data);
        localStorage.setItem("username", loginForm.email);
        navigate("../questionnare");
      },

      onFailure: (err) => {
        console.error("onFailure:", err);
        alert("Invalid credentials");
      }
    });
  };

  return (
    <form onSubmit={handleLoginForm}>
      <div className="form-body">
        <div>
          <label>Username</label>
          <input
            type="text"
            value={loginForm.email}
            name="email"
            onChange={handleFormValueChange}
          ></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleFormValueChange}
          ></input>
        </div>
        <button type="submit">Submit</button>
        <div>
          <label>New User?</label>
          <a
            style={{ paddingLeft: "14px", textDecoration: "none" }}
            href="/registration"
          >
            {" "}
            Sign Up!
          </a>
        </div>
      </div>
    </form>
  );
}

export default Login;
