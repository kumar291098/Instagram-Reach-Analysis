from flask import Flask, request, jsonify
import pickle
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/load_model', methods=['GET'])
def load_model():
    try:
        with open('instagramReachAnalysis_trained_model.pkl', 'rb') as f:
            global model
            model = joblib.load('instagramReachAnalysis_trained_model.pkl')
        return jsonify({"message": "Model loaded successfully"})
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except pickle.UnpicklingError as e:
        return jsonify({"error": f"Error unpickling file: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    

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
