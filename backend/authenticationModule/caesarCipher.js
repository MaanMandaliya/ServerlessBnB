const firebaseFunctions = require("firebase-functions");
const firebaseAdmin = require("firebase-admin");
const { google } = require("googleapis");
firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore();
exports.helloWorld = firebaseFunctions.https.onRequest(async (request, response) => {
    
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Headers', '*');
    response.set('Access-Control-Allow-Methods', '*');
    
    if (request.method === 'OPTIONS') {
        response.end();
    }
    else{
        let userSecretkey = '';
        let validUser=false;
        console.log(request.body.username +" Username");
        await db.collection('userAuthentication').doc(request.body.username).get()
            .then(async(doc) => {
                if (!doc.exists) {
                    console.log('No records for that user exists!');
                    response.status(401).send(validaUser);
                } else {
                    console.log(userSecretkey +" secret key");
                    userSecretkey = Number(doc.data()['secretkey']);
                    
                    validUser= encryptToValidate(request.body.cipherString, request.body.userInput, userSecretkey);
                    if(validUser){
                        await sheetModel();
                        response.status(200).send(validUser);
                    }else{
                        response.status(401).send(validUser);
                    }
                }
            })
            .catch(err => {
                console.error('Error getting document', err);
                response.status(401).send(validUser);
            })
    }
    
});

const sheetModel=async()=>{
    const spreadsheetId = "1qQ7WrQTKC81QWAp81twy3RWqRx-Kzzjb2KclT-gh9N4";
    const auth = new google.auth.GoogleAuth({
        keyFile: './gckey.json',
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
    await googleSheetsInstance.spreadsheets.values.append({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range: "Sheet1!A:Z", //sheet name and range of cells
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values: [[new Date().toISOString().split('T')[0],"logged-in",1]],
        },
    });
}

function encryptToValidate(systemStr, userInput, userSecretkey) {

    let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let output = '';

    for (let i = 0; i < systemStr.length; i++) {
        let count = 0;
        for (let j = 0; j < alphabets.length; j++) {
            if (systemStr[i] === alphabets[j]) {
                count = count + userSecretkey;
                while (count > 25) {
                    count = count - 26;
                }
                output += (alphabets[count]);
            } else {
                count++;
            }
        }
    }

    return output.toUpperCase() === userInput.toUpperCase()?true:false;
};