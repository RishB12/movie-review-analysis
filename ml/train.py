
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# STEP 1: Load the labelled reviews
df = pd.read_csv("../db/IMDB Dataset.csv")

df = df.dropna(subset=["review", "sentiment"])
df = df.drop_duplicates(subset=["review"])

X = df["review"].astype(str)
y = df["sentiment"].str.strip().str.lower()

print(f"Loaded {len(df):,} reviews")
print(y.value_counts())

# STEP 2: Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Training examples: {len(X_train):,}")
print(f"Testing examples: {len(X_test):,}")

# STEP 3: Build the learning pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=50_000,
        ngram_range=(1, 2),
        strip_accents="unicode"
    )),
    ("classifier", LogisticRegression(max_iter=1000))
])

# STEP 4: TRAIN THE MODEL
print("\nTraining SentimentGPT...")
model.fit(X_train, y_train)

print("Training complete!")

# STEP 5: Test on held-out reviews
predictions = model.predict(X_test)

print("\nAccuracy:", round(
    accuracy_score(y_test, predictions) * 100, 2
), "%")

print(classification_report(y_test, predictions))

# STEP 6: Save the trained model
joblib.dump(model, "sentiment_model.joblib")

print("Model saved!")
