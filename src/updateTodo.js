const AWS = require('aws-sdk');

const updateTodo = async (event) => {

  const { id } = event.pathParameters,
        { completed } = JSON.parse(event.body);

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    let todo, responseData;

    // Find the todo item
    const result = dynamoDB.get({ 
        TableName: 'TodoTable',
        Key: { id }
    }).promise()

    todo = (await result).Item

    if (todo) { // If it exists, update it's completed status
        const updateResponse = await dynamoDB.update({
            TableName: 'TodoTable',
            Key: { id },
            UpdateExpression: `set completed = :completed`,
            ExpressionAttributeValues: {
                ':completed': completed
            },
            ReturnValues: 'ALL_NEW'
        }).promise();

        console.log('updateResponse', updateResponse)

        responseData = {
            statusCode: 200,
            body: JSON.stringify({ response: 'success' })
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
  handler: updateTodo
}
