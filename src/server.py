from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

model_path = Path(__file__).resolve().parent.parent / "model" / "sentiment_model.joblib"
model = joblib.load(model_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class PredictionRequest(BaseModel):
    review: str = Field(min_length=1, max_length=10000)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict_sentiment(request: PredictionRequest):
    review = request.review.strip()
    if not review:
        raise HTTPException(status_code=422, detail="Review cannot be blank.")

    prediction = model.predict([review])[0]
    probabilities = model.predict_proba([review])[0]
    classes = model.classes_
    confidence = probabilities[list(classes).index(prediction)] * 100
    return {"sentiment": prediction, "confidence": confidence}
