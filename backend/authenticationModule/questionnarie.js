const aws = require('aws-sdk');
const ddb = new aws.DynamoDB({apiVersion: '2012-08-10'});

const table = "users";
exports.getQuestionList = async (username) => {
   let questions=[];
     const params = {
      Key: {
       "email": {
         S: username
        }, 
      }, 
      TableName: table
     };
     
     const dynamoRes = await ddb.getItem(params).promise();
     console.log('response ', JSON.stringify(dynamoRes));
    
    for(let i=1;i<=3;i++){
      questions.push({["question_"+i]:dynamoRes.Item['question_'+i]['S']});
    }
  
    let questionNum=getRandomNumber();
    return questions[randomNum-1]['question_'+questionNum];
};

const getRandomNumber = ()=> {
        return Math.floor(
            Math.random() * (3 - 1 + 1) + 1
        )
    }

exports.validateAnswers = async (reqbdy) => {
     const params = {
      Key: {
       "email": {
         S: reqbdy.username
        }, 
      }, 
      TableName: table
     };
     
     const dynamoRes = await ddb.getItem(params).promise();
     console.log('response ', JSON.stringify(dynamoRes));
    
    for(let i=1;i<=3;i++){
        if(reqbdy[dynamoRes.Item['question_'+i]['S']] && dynamoRes.Item['answer_'+i]['S']==reqbdy[dynamoRes.Item['question_'+i]['S']]){
            return true;
        }
    }
    return false;
};