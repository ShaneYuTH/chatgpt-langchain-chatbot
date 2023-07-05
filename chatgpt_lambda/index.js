// Import the necessary libraries and modules
const AWS = require("aws-sdk");
const { Configuration, OpenAIApi } = require("openai");
const { prompt } = require("./prompt");

// Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const lambda = new AWS.Lambda();

// Main function for handling incoming events
exports.handler = async (event) => {
  const user_input = event.user_input;
  const user_id = event.user_id;

  if (!user_input || !user_id) {
    return {
      statusCode: 400,
      body: { message: "Missing User Input or User ID" },
    };
  }

  try {
    // Create a completion using the OpenAI API
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt + user_input,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    // Prepare the payload for the Lambda invocation
    const payload = {
      FunctionName: "peoplesearch-lambda-test",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        user_id: user_id,
        statusCode: 200,
        body: JSON.stringify(response.data),
      }),
    };

    // Invoke the downstream Lambda function and await the result
    const result = await lambda.invoke(payload).promise();
    const resultPayload = JSON.parse(result.Payload);
    return resultPayload;
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
