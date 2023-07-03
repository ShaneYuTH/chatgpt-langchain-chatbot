import boto3
from flask import Flask, request, session
import os
import pickle
from flask_session import Session
from datetime import timedelta
import logging

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=10)
Session(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

s3 = boto3.client('s3')


def download_file_from_s3(bucket, key, filename):
    try:
        s3.download_file(bucket, key, filename)
    except Exception as e:
        logger.error(f"Failed to download file: {e}")
        raise


@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_id = request.json.get('user_id')
        question = request.json.get('question')

        if not user_id or not question:
            return {'error': 'Missing user_id or question'}, 400

        # Load the user's qa object from session, or from S3 if it's not in session
        qa = session.get(user_id)
        if not qa:
            pkl_file = f"{user_id}.pkl"
            if not os.path.exists(pkl_file):
                bucket = 'yu-opensearch-result-test'
                key = f'search-results-clean/{user_id}/{user_id}.pkl'
                download_file_from_s3(bucket, key, pkl_file)
                if not os.path.exists(pkl_file):
                    return {'error': 'No chat session found for this user_id'}, 404

            with open(pkl_file, 'rb') as f:
                qa = pickle.load(f)

    # Get answer
        answer = qa({"question": question})

        # Store the updated qa object in session
        session[user_id] = qa
        return {'answer': answer["answer"]}
    except Exception as e:
        logger.error(f"Failed to process chat: {e}")
        return {'error': str(e)}, 500


@app.route('/end_chat', methods=['POST'])
def end_chat():
    try:
        user_id = request.json.get('user_id')

        if not user_id:
            return {'error': 'Missing user_id'}, 400

        # Remove the user's qa object from session
        session.pop(user_id, None)

        # Delete the .pkl file
        pkl_file = f"{user_id}.pkl"
        if os.path.exists(pkl_file):
            os.remove(pkl_file)

        return {'message': 'Chat ended successfully'}
    except Exception as e:
        logger.error(f"Failed to end chat: {e}")
        return {'error': str(e)}, 500


@app.route('/health', methods=['GET'])
def health_check():
    return ({'status': 'healthy'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
