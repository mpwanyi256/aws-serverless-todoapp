const AWS = require('aws-sdk');

const getTodos = async (event) => {

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    let todos;

    const results = dynamoDB.scan({ TableName: 'TodoTable' }).promise()

    todos = (await results).Items

    return {
        statusCode: 200,
        body: JSON.stringify({ todos }),
    };
  } catch(e) {
      console.log('Error fetching todos', e)
    return {
        statusCode: 401,
        body: JSON.stringify({
            message: 'Fetching items failed',
            error: e.message
        })
    }
  }
  
};

module.exports = {
  handler: getTodos
}
