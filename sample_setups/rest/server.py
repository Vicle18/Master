from flask import Flask, jsonify
import datetime
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
@app.route('/example', methods=['GET'])
def example():
    # Generate a random number between 1 and 10.
    num = random.randint(1, 10)
    response = jsonify({"number": num})

    return response

@app.route('/data')
def get_data():
    now = datetime.datetime.now()
    hour_ago = now - datetime.timedelta(hours=1)
    step = (now - hour_ago) / 10

    data = []
    for i in range(10):
        timestamp = hour_ago + (i * step)
        value = random.randint(1, 100)
        data.append({'timestamp': timestamp.isoformat(), 'value': value})

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

#we have set the Access-Control-Allow-Origin header to http://localhost:3000 in both the response from the example endpoint as well as the after_request decorator. The after_request decorator ensures that the header is set for all responses from the Flask application.