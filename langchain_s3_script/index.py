#!/usr/bin/env python3
import os
import pickle
import boto3
import json

from botocore.exceptions import NoCredentialsError

from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import JSONLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

import hr_stuff_prompt

# Initialize S3 and SQS clients
s3 = boto3.client('s3')
sqs = boto3.client('sqs')

# Get queue URL from environment variables
queue_url = os.getenv('SQS_QUEUE_URL')

# Function to delete a file from given path and handle any OS error
def delete_file(path):
    try:
        os.remove(path)
    except OSError as e:
        print(f"Error: {e.filename} - {e.strerror}.")

# Function to process a file: download it, process it, and then upload it back to S3
def process_file(bucket, key):
    download_path = '/tmp/{}'.format(os.path.basename(key))
    try:
        s3.download_file(bucket, key, download_path)
    except Exception as e:
        print(f"Error downloading file: {e}")
        return

    # Load JSON content using a specific schema
    loader = JSONLoader(
        file_path=download_path,
        jq_schema='.hits.hits[]._source',
        text_content=False)
    
    try:
        docs = loader.load()
    except ValueError as e:
        if str(e) == "Cannot iterate over null (null)":
            print("Error: JSON content is null, no results are found")
            return
        else:
            raise e

    # Build a vector store (FAISS) using OpenAI embeddings
    db = FAISS.from_documents(docs, OpenAIEmbeddings())
    # Create a conversation memory buffer
    memory = ConversationBufferMemory(
        memory_key="chat_history", return_messages=True)

    PROMPT = hr_stuff_prompt.PROMPT_SELECTOR.get_prompt(
        ChatOpenAI(temperature=0, model="gpt-4"))
    CONDENSE_QUESTION_PROMPT = hr_stuff_prompt.CONDENSE_QUESTION_PROMPT

    # Set up the conversational retrieval chain
    qa = ConversationalRetrievalChain.from_llm(
        llm=ChatOpenAI(temperature=0, model="gpt-4"),
        retriever=db.as_retriever(search_kwargs={"k": 10}),
        condense_question_prompt=CONDENSE_QUESTION_PROMPT,
        verbose=False,
        condense_question_llm=ChatOpenAI(temperature=0, model="gpt-4"),
        combine_docs_chain_kwargs={"prompt": PROMPT},
        memory=memory,)

    # Save the conversational retrieval chain (qa) to a local pickle file
    with open('/tmp/qa.pkl', 'wb') as f:
        pickle.dump(qa, f)
    # Upload the pickle file to the same S3 bucket
    try:
        s3.upload_file('/tmp/qa.pkl', bucket, key.replace('.json', '.pkl'))
        print("File successfully uploaded")
    except NoCredentialsError:
        print("Credentials not available")
    except Exception as e:
        print(f"Error uploading file: {e}")
    finally:
        # Clean up local files
        delete_file('/tmp/qa.pkl')
        delete_file(download_path)

# Function to handle incoming SQS messages and process corresponding S3 files
def handler():    
    while True:
        response = sqs.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=20
        )

        if 'Messages' in response:
            for message in response['Messages']:
                try:
                    event = json.loads(message['Body'])
                    bucket = event['Records'][0]['s3']['bucket']['name']
                    key = event['Records'][0]['s3']['object']['key']
                except KeyError:
                    print("Error: Message does not contain object key info")
                    break
                process_file(bucket, key)

                try:
                    sqs.delete_message(
                        QueueUrl=queue_url,
                        ReceiptHandle=message['ReceiptHandle']
                    )
                except Exception as e:
                    print(f"Error deleting message from SQS: {e}")
        else:
            print("No new files found")

# Start the handler
handler()