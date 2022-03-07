const { v4 } = require('uuid');
const AWS = require('aws-sdk');

const addTodo = async (event) => {

  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { todo } = JSON.parse(event.body),
        createdAt = new Date().toDateString(),
        id = v4();

  const newTodo = {
    id,
    todo,
    createdAt,
    completed: false,
  }

  const response = await  dynamoDB.put({
    TableName: 'TodoTable',
    Item: newTodo
  }).promise();

  console.log('dynamodb response', response)

  return {
    statusCode: 201,
    body: JSON.stringify(newTodo),
  };
};

module.exports = {
  handler: addTodo
}
