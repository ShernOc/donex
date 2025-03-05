from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

@app.route('/profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    # Simulating saving the data (you can integrate with a database here)
    print("Received profile data:", data)

    # Return a success response
    return jsonify({"message": "Profile updated successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True)