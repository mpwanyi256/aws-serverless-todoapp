const AWS = require('aws-sdk');

const fetchTodo = async (event) => {

  const { id } = event.pathParameters

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    let todo, responseData;

    const result = dynamoDB.get({ 
        TableName: 'TodoTable',
        Key: { id }
    }).promise()

    todo = (await result).Item

    if (todo) {
        responseData = {
            statusCode: 200,
            body: JSON.stringify({ todo })
        }
    } else {
        responseData = {
            statusCode: 404,
            body: JSON.stringify({ 
                error: true, 
                message: 'Sorry, no todo found with provided id' 
            })
        }
    }

    return responseData;

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
  handler: fetchTodo
}
