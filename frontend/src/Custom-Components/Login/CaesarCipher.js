import { React } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CaesarCipher() {
  const [strToEncrypt, setStrToEncrypt] = useState();

  useEffect(() => {
    setStrToEncrypt(createCipherString());
  }, []);

  const createCipherString = () => {
    var cipherString = "";
    var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 4; i++) {
      cipherString =
        cipherString +
        alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }
    return cipherString;
  };

  const [encryptedStrForm, setValues] = useState({
    encryptedStr: "",
  });

  let navigate = useNavigate();

  const handleCaesarCipherValueChange = (event) => {
    const { name, value } = event.target;
    // console.log(event+ "  ");
    setValues({ ...encryptedStrForm, [name]: value });
  };

  const handleCaesarCipherForm = (event) => {
    event.preventDefault();
    if (encryptedStrForm.encryptedStr == "") {
      alert("Please enter encrypted value to proceed");
      return;
    }
    const requestBody = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        username: localStorage.getItem("username"),
        cipherString: strToEncrypt,
        userInput: encryptedStrForm.encryptedStr,
      },
    };

    let obj = {
      username: localStorage.getItem("username"),
      cipherString: strToEncrypt,
      userInput: encryptedStrForm.encryptedStr,
    };

    console.log(JSON.stringify(obj));
    axios
      .post(
        "https://europe-west2-cipher-356616.cloudfunctions.net/validateCipher", // change this url to Main google cloud and have cloud function there
        obj
      ) // hot cloud function to validate if entered encrypted value is same as system
      .then((response) => {
        navigate("../dashboard");

        localStorage.setItem("group28-logged-in", true);
      })
      .catch((erroe) => {
        console.log(erroe);
        alert("Your encrypted msg did not match with system");
      });
  };

  return (
    <form onSubmit={handleCaesarCipherForm}>
      <div className="form-body">
        <div>
          <div>Encrypt for authentication</div>
          <label>
            <b>{strToEncrypt}</b>
          </label>
          <input
            type="text"
            value={encryptedStrForm.encryptedStr}
            name="encryptedStr"
            onChange={handleCaesarCipherValueChange}
          ></input>
        </div>

        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default CaesarCipher;

// https://us-east1-group28serverless-356606.cloudfunctions.net/caeserCipher
