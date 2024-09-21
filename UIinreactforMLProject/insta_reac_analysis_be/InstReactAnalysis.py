from flask import Flask, request, jsonify
import pickle
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load('instagramReachAnalysis_trained_model.pkl')
except FileNotFoundError:
    print("Model file not found. Ensure the file path is correct.")
    model = None  # Set to None or handle it appropriately

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        likes = float(data.get('likes'))
        saves = float(data.get('saves'))
        comments = float(data.get('comments'))
        shares = float(data.get('shares'))
        profile_visits = float(data.get('profile_visits'))
        follows = float(data.get('follows'))

        # Create the features array
        features = np.array([[likes, saves, comments, shares, profile_visits, follows]])

        # Predict impressions using the model
        impression = model.predict(features)

        # Return the prediction
        return jsonify({"impression": impression[0]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
