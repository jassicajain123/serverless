"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context) => {
  try {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: "Content-Asset3",
    Item: {
      uniqueId: uuid.v1(),
      studentname: data.name,
      school: data.school,
      class: data.class,
      rollNo:data.rollNo,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
    await dynamoDb.put(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        success: true,
        data: params.Item,
      }),
    };
    return response;
  } 
  catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        status: error.statusCode,
        success: false,
        data: error,
      }),
    };
  }
};

module.exports.list = async () => {
  
  try {
    const params = {
      TableName: "Content-Asset3",
    };
    const students = await dynamoDb.scan(params).promise();
    if (!students.Items)
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          success: false,
          data: "No list found",
        }),
      };
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        success: true,
        data: students.Items,
      }),
    };
    return response;
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        status: error.statusCode,
        success: false,
        data: error,
      }),
    };
  }
};

module.exports.get = async (event) => {
  try {
    const params = {
      TableName: "Content-Asset3",
      Key: {
        uniqueId: event.pathParameters.studentID,
      },
    };
    const student = await dynamoDb.get(params).promise();
    if (!student.Item)
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: 404,
          success: false,
          data: "No student found",
        }),
      };
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        success: true,
        data: student.Item,
      }),
    };
    return response;
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        status: error.statusCode,
        success: false,
        data: error,
      }),
    };
  }
};

module.exports.delete = async (event) => {
  try {
    const params = {
      TableName: "Content-Asset3",
      Key: {
        uniqueId: event.pathParameters.studentID,
      },
    };
    await dynamoDb.delete(params).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        status: 200,
        success: true,
        data: event.pathParameters.studentID,
      }),
    };
    return response;
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        status: error.statusCode,
        success: false,
        data: error,
      }),
    };
  }
};

module.exports.update = (event, context, callback) => {
  let {studentname,school,rollNo } = JSON.parse(event.body);
  const params = {
    TableName: 'Content_Asset3',
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: 'set studentname = :c,info.school =:b,info.rollNo =:i',
    ExpressionAttributeValues: {
      ':c': studentname,
      ':b': school,
      ":i": rollNo
    },
    ReturnValues: "UPDATED_NEW"
  };

  dynamoDb.update(params, function (err, data) {
    let mainObj = {};
    if (err) callback(null, { statusCode: 200, body: JSON.stringify(err) });
    else
      mainObj = {
        studentname: data.Attributes.studentname,
        school: data.Attributes.info.school,
        rollNo: data.Attributes.info.rollNo
      }
    callback(null, { statusCode: 200, body: JSON.stringify(mainObj) });
  });
};