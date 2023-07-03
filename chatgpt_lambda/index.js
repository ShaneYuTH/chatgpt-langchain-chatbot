const AWS = require("aws-sdk");
const { Configuration, OpenAIApi } = require("openai");
const { prompt } = require("./prompt");

const configuration = new Configuration({
  // organization: procss.env.OPENAI_ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const lambda = new AWS.Lambda();

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
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt + user_input,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const payload = {
      FunctionName: "peoplesearch-lambda-test",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        user_id: user_id,
        statusCode: 200,
        body: JSON.stringify(response.data),
      }),
    };

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
