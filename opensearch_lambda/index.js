const AWS = require("aws-sdk");
const { client, indexName } = require("./config");
const { clean } = require("./utils");

// Create a new S3 instance
const s3 = new AWS.S3();

// Exported AWS Lambda function
exports.handler = async (event) => {
  // Extract user id
  // console.log("Event here: " + JSON.stringify(event));
  const userId = event.user_id;
  if (!userId) {
    return {
      statusCode: 400,
      body: { message: "Missing User ID" },
    };
  }

  const bodyData = JSON.parse(event.body);
  console.log("Body here: " + JSON.stringify(bodyData));
  const result = bodyData.choices[0].text
    .split("\n")
    .filter((line) => Boolean(line) && !line.includes("Desired Output"))
    .map((line) => line.replace(/[\{\}\"]+/g, ""));

  console.log("Text here: " + result);

  const values = {};

  result.forEach((item) => {
    if (item.trim() !== "") {
      const [key, value] = item.split(":").map((str) => str.trim());

      if (key && value) {
        let valueArray = value
          .replace(/[\[\]\"]+/g, "")
          .split(",")
          .map((item) => item.trim());

        if (valueArray[valueArray.length - 1] === "") {
          valueArray.pop();
        }

        values[key.replace(",", "")] = valueArray;
      }
    }
  });

  console.log("Values here: " + JSON.stringify(values));

  const query = {
    bool: {
      should: [],
    },
  };

  // Check for "industry", "location", "company", "skills", and "jobt_itle" from lambda event and add it to the query

  if (values.industry) {
    values.industry.forEach((industry) => {
      query.bool.should.push({
        match_phrase: {
          industry_name: {
            query: industry,
          },
        },
        match_phrase: {
          company_keywords: {
            query: industry,
          },
        },
      });
    });
  }
  if (values.location) {
    values.location.forEach((location) => {
      query.bool.should.push({
        match_phrase: {
          location_names_all: {
            query: location,
          },
        },
      });
    });
  }
  if (values.company) {
    values.company.forEach((company) => {
      query.bool.should.push({
        match_phrase: {
          position_company_name: {
            query: company,
          },
        },
      });
    });
  }
  if (values.skills) {
    values.skills.forEach((skill) => {
      query.bool.should.push({
        match_phrase: {
          talent_skill: {
            query: skill,
          },
        },
      });
    });
  }
  if (values.job_title) {
    values.job_title.forEach((jobTitle) => {
      query.bool.should.push({
        match_phrase: {
          "job_history.position_name": {
            query: jobTitle,
          },
        },
      });
    });
  }

  query.bool.minimum_should_match = 2;

  console.log("Query here: " + JSON.stringify(query));

  // Search the index using the query in lambda event
  const { body } = await client.search({
    index: indexName,
    body: {
      query: query,
      size: 10,
    },
  });

  const cleanBody = clean(body);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `search-results-clean/${userId}/${userId}.json`,
    Body: JSON.stringify(cleanBody),
    ContentType: "application/json",
  };

  try {
    const s3Response = await s3.upload(params).promise();
    console.log(`File uploaded successfully at ${s3Response.Location}`);
    const response = {
      statusCode: 200,
      body: JSON.stringify(cleanBody),
    };
    console.log(response);
    return response;
  } catch (error) {
    console.log(`Error uploading file: ${error}`);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
    return response;
  }
};
