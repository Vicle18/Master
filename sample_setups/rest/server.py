from flask import Flask, jsonify
import random

app = Flask(__name__)

@app.route('/example', methods=['GET'])
def example():
    # Generate a random number between 1 and 10.
    num = random.randint(1, 10)

    # Return the number as a JSON response.
    return jsonify({"number": num})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)