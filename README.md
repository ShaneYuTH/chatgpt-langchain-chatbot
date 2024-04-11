<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<h3 align="center">ChatGPT-Langchain-ChatBot</h3>

  <p align="center">
    Simple SaaS chatbot solution using ChatGPT, Langchain and AWS
    <br />
    <a href="https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/issues">Report Bug</a>
    ·
    <a href="https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setting-up-openai-api">Setting Up OpenAI API</a></li>
        <li><a href="#setting-up-aws">Setting Up AWS</a></li>
        <li><a href="#setting-up-each-component">Setting Up Each Component</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <ul>
        <li><a href="#user-interaction">User Interaction</a></li>
        <li><a href="#keyword-extraction">Keyword Extraction</a></li>
        <li><a href="#target-search">Target Search</a></li>
        <li><a href="#data-processing">Data Processing</a></li>
        <li><a href="#response-generation">Response Generation</a></li>
      </ul>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Flowchart][product-flowchart]](https://example.com)

The chatgpt-langchain chatbot is a SaaS (Software as a Service) architecture deployed on Amazon Web Services (AWS). It leverages the capabilities of OpenAI's powerful language model, GPT-4, LangChain's amazing framework, and combines it with AWS services to create a seamless and efficient chatbot solution.

The project involves several components that interact to process natural language queries, search a talent pool, and respond to user requests. These components include AWS Lambda functions, OpenSearch, S3, SQS, and a chatbot app deployed on AWS Fargate.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

 
* [![AWS Lambda][Lambda]][Lambda-url]
* [![AWS Fargate][Fargate]][Fargate-url]
* [![AWS S3][S3]][S3-url]
* [![AWS SQS][SQS]][SQS-url]
* [![OpenSearch][OpenSearch.org]][OpenSearch-url]
* [![Langchain][Langchain.com]][Langchain-url]
* [![OpenAI][OpenAI.com]][OpenAI-url]
* [![Flask][Flask.com]][Flask-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This section will guide you on how to get started with the ChatGPT-LangChain chatbot application.

### Prerequisites

* OpenAI Account: You will need to have an [OpenAI](https://platform.openai.com/) account to use the OpenAI API.

* AWS Account: You will also need an [AWS](https://aws.amazon.com/) account as the application is deployed on AWS services.

* Python: The application is written in Python. Make sure to have Python 3.7 or higher installed.

* Node.js: The lambda function is written in Node.js/JavaScript. Make sure to have Node.js 18.x or higher installed.

* Docker: [Docker](https://www.docker.com/) image is required for fargate to deploy the script and chatbot application.

### Setting Up OpenAI API
1. Visit the OpenAI official website and create an account if you don't have one already.
2. Once you're logged in, go to the API section.
3. Generate a new API key. Save this key in a secure place as you will need it for the application.

### Setting Up AWS
1. If you don't have an AWS account already, visit the official AWS website and create a new account.
2. Once you're logged in, go to the Identity and Access Management (IAM) console and create a new user.
3. Assign the necessary permissions to the user to access the required AWS services (Lambda, OpenSearch, S3, SQS, Fargate).
4. Once the user is created, you will be provided with an Access Key ID and Secret Access Key. Save these in a secure place as you will need them for the application.


### Setting Up Each Component

#### Lambda Function - OpenAI API
1. In the AWS console, go to the Lambda service.
2. Click on "Create function".
3. Give your function a name, select the Node.js 18.x runtime, and assign the appropriate execution role.
4. Install NPM packages
   ```sh
   npm install
   ```
5. Save the chatgpt_lambda as a zip file and upload to the function you just created.
6. In the Environment Variables section, enter your OpenAI API key.
7. For the execution role, make sure it has the proper permission to talk to AWS Lambda.
8. Save your function.

#### Lambda Function - OpenSearch
1. Follow the same steps as above to create another Lambda function and upload the opensearch_lambda to your function.
2. Create an S3 bucket for storing retrieved results. Enable SQS for S3 that listens to every new file written.
3. In the Environment Variables section, enter your [OpenSearch](https://aws.amazon.com/opensearch-service/) Credentials and S3 bucket URL. Please note, while this code can function with other databases, adjustments will be necessary within the connection and query section to ensure proper data retrieval.
4. For the execution role, make sure it has the proper permission to talk to AWS S3.
5. Save your function.

#### ECR/ECS(Fargate) - Python Script
1. Navigate to langchain_s3_script folder and build docker image.
2. Follow the ECR (Amazon Elastic Container Registry) guide to create a repository and upload the image.
3. Follow the ECS (Amazon Elastic Container Service) guide to create a ECS cluster and a task definition with the image. Remember to use Fargate as underlying infrastructure.
4. In the task definition, set the environment variables for AWS Access Key ID, Secret Access Key, OpenAI API Key, and any other necessary variables.
5. Make sure the task role has proper permission to write to AWS S3.
4. Run the Fargate task.

#### ECR/ECS(Fargate) - Flask App Chatbot
1. Follow the same steps above to create another image and upload it to a new repo under ECR.
2. Create a new task definition with the image. Remember to use Fargate as underlying infrastructure. We will use the same cluster to deploy the flask app.
3. In the task definition, set the environment variables for AWS Access Key ID, Secret Access Key, and any other necessary variables.
5. Make sure the task role has proper permission to read from AWS S3.
6. Run the Fargate task.

After setting up each component, the ChatGPT-LangChain chatbot application should be up and running. You can now interact with the chatbot through the Flask app's exposed endpoint(task's exposed IP:8000).

Remember to periodically monitor and maintain your AWS services to ensure the smooth operation of your application.



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

This chatbot is built around the concept of people search, aiming to match user queries with potential talent or resources from your database. Its SaaS architecture and cloud deployment make it easily scalable and accessible from anywhere. With necessary modifications, it can be adapted to work with any other type of database or use case.
Below is a step-by-step example usage of the chatbot:

### User Interaction
A user interacts with the chatbot, asking a question like, "I am looking for a Python developer with machine learning experience working in the tech industry".
   
### Keyword Extraction
The chatbot sends this query to a Lambda function which uses the OpenAI API to extract keywords from the question. In this case, the keywords might be "Python developer", "machine learning experience", and "tech industry".

### Target Search
The extracted keywords are then sent to another Lambda function. This function uses key words to construct a query that searched in a talent pool in AWS OpenSearch for profiles that match these keywords. The results are stored in an S3 bucket as .json file.

### Data Processing
A message with the information about the newly stored results is sent to an SQS queue. A Python script running on Fargate listens to this queue. When it detects the new message, it retrieves the results from the S3 bucket, processes them into a Langchain chain object, and pickles it for storage.

### Response Generation
When the user asks for the search results, the Flask chatbot app retrieves the pickled Langchain object from the user's folder in the S3 bucket. It unpickles the object and uses the chain to generate a response, which would be a list of potential candidates that match the user's query. 

One powerful feature of the Langchain chain object is its ability to support follow-up questions. Users can continue the conversation and ask more detailed questions about the search results. The chatbot will leverage the stored Langchain chain object to provide relevant answers without needing to repeat the earlier steps. This saves time and computational resources, while providing a seamless conversational experience.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Tianhao Yu - [LinkedIn](https://www.linkedin.com/in/yutianhao/) - shaneyu0704@gmail.com

Project Link: [https://github.com/ShaneYuTH/chatgpt-langchain-chatbot](https://github.com/ShaneYuTH/chatgpt-langchain-chatbot)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Langchain](https://python.langchain.com/docs/get_started/introduction.html)
* [OpenAI](https://platform.openai.com/)
* [FAISS](https://github.com/facebookresearch/faiss)
* [AWS](https://aws.amazon.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot.svg?style=for-the-badge
[contributors-url]: https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot.svg?style=for-the-badge
[forks-url]: https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/network/members
[stars-shield]: https://img.shields.io/github/stars/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot.svg?style=for-the-badge
[stars-url]: https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/stargazers
[issues-shield]: https://img.shields.io/github/issues/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot.svg?style=for-the-badge
[issues-url]: https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/issues
[license-shield]: https://img.shields.io/github/license/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot.svg?style=for-the-badge
[license-url]: https://github.com/ShaneYuTH/hirebeat-chatgpt-langchain-chatbot/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/yutianhao
[product-flowchart]: images/chatgpt-lambda-chatbot.jpeg
[Lambda]: https://img.shields.io/static/v1?style=for-the-badge&message=AWS+Lambda&color=222222&logo=AWS+Lambda&logoColor=FF9900&label=
[Lambda-url]: https://aws.amazon.com/lambda/ 
[Fargate]: https://img.shields.io/static/v1?style=for-the-badge&message=AWS+Fargate&color=222222&logo=AWS+Fargate&logoColor=FF9900&label=
[Fargate-url]: https://aws.amazon.com/fargate/
[S3]: https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+S3&color=569A31&logo=Amazon+S3&logoColor=FFFFFF&label=
[S3-url]: https://aws.amazon.com/s3/
[SQS]: https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+SQS&color=FF4F8B&logo=Amazon+SQS&logoColor=FFFFFF&label=
[SQS-url]: https://aws.amazon.com/sqs/
[OpenSearch.org]: https://img.shields.io/static/v1?style=for-the-badge&message=OpenSearch&color=005EB8&logo=OpenSearch&logoColor=FFFFFF&label=
[OpenSearch-url]: https://opensearch.org/
[OpenAI.com]: https://img.shields.io/static/v1?style=for-the-badge&message=OpenAI&color=412991&logo=OpenAI&logoColor=FFFFFF&label=
[OpenAI-url]: https://openai.com/
[Flask.com]: https://img.shields.io/static/v1?style=for-the-badge&message=Flask&color=000000&logo=Flask&logoColor=FFFFFF&label=
[Flask-url]: https://flask.palletsprojects.com/en/2.3.x/
[Langchain.com]: https://img.shields.io/static/v1?style=for-the-badge&message=Langchain&color=000000&logo=Langchain&logoColor=FFFFFF&label=
[Langchain-url]: https://python.langchain.com/docs/get_started/introduction.html
