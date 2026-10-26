
import joblib

# Load the trained pipeline
model = joblib.load("sentiment_model.joblib")

print("SentimentGPT is ready! Type 'quit' to exit.")

while True:
    review = input("\nEnter a movie review: ")

    if review.strip().lower() == "quit":
        break

    if not review.strip():
        print("Please enter a review.")
        continue

    # Predict the sentiment
    prediction = model.predict([review])[0]

    # Get the model's estimated probabilities
    probabilities = model.predict_proba([review])[0]
    classes = model.classes_

    confidence = probabilities[list(classes).index(prediction)] * 100

    print(f"\nSentiment: {prediction.upper()}")
    print(f"Model confidence: {confidence:.2f}%")
