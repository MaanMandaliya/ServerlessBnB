const qValidation=require('./questionnaire');

exports.handler = async (event) => {
    // TODO implement
    let response;
    let httpMethod = event['requestContext']['http']['method'];
    let path = event['requestContext']['http']['path'];
    

    //console.log("Params "+ queryParams.username);
    console.log(path);
    
    if(httpMethod=='POST'){
       let userReq = JSON.parse(event['body']);
       console.log(userReq + " Hello body");
       if(path=='/questionnaire/validateAnswers'){
           const validateCheck=await qValidation.validateAnswers(userReq);
           //console.log( " Hjjjjjjj" + JSON.stringify(body));
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
     let qParams=event['queryStringParameters'];
         if(path=='/questionnaire/getQuestionList'){
           const randomQ=await qValidation.getQuestionList(qParams.username);
           response={
                statusCode: 200,
                body: {"question":randomQ}
            };
        }
    }
    
    console.log(response);
    return response;
};