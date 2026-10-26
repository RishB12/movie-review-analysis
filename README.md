# 🎬 Movie Review Analysis

A machine learning project that analyzes movie reviews and predicts their sentiment using a trained model built with **Python** and **scikit-learn**.

## ✨ Overview

This project explores sentiment analysis by classifying movie reviews based on their text. It uses a machine learning model trained on the [IMDb Dataset of 50K Movie Reviews](https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews) to identify whether a review expresses a positive or negative sentiment.

## 🛠️ Tech Stack

- **Python** for the machine learning backend
- **scikit-learn** for model training and sentiment classification
- **JavaScript, HTML, and CSS** for the web interface
- **Electron** for desktop application functionality

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/RishB12/movie-review-analysis.git
cd movie-review-analysis
```

### 2. Set up the Python environment

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

On Windows, activate it with:

```powershell
.venv\Scripts\activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Download the dataset

1. Download the [IMDb Dataset of 50K Movie Reviews from Kaggle](https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews).
2. Create a directory named `db` in the project root, if it doesn't already exist.
3. Place the downloaded dataset in that directory.

The expected dataset path is:

```text
db/IMDB Dataset.csv
```

### 4. Install the JavaScript dependencies

```bash
npm install
```

## 🚀 Running the Project

Start the application using the scripts defined in `package.json`:

```bash
npm run dev
```

This lists the available npm scripts. Run the appropriate script to launch the web interface or desktop application.

> **Note:** The exact command depends on the scripts configured in `package.json`.

## 🧠 Machine Learning

The project includes scripts for training and using the sentiment analysis model.

- `ml/train.py` handles model training.
- `ml/predict.py` handles sentiment prediction.

Pre-trained model files are also included in the repository, where available.

## 📁 Project Structure

```text
movie-review-analysis/
├── db/                  # Movie review dataset
├── electron/             # Electron application
├── ml/                   # Machine learning scripts
│   ├── train.py          # Model training
│   └── predict.py        # Sentiment prediction
├── model/                # Model artifacts
├── src/                  # Application source code
├── index.html            # Web app entry point
├── package.json          # Node.js dependencies and scripts
├── requirements.txt      # Python dependencies
└── vite.config.js        # Vite configuration
```

## 📊 Dataset

The project uses the IMDb Dataset of 50K Movie Reviews, containing movie reviews labelled with positive or negative sentiment.

**Dataset source:** [Kaggle: IMDb Dataset of 50K Movie Reviews](https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews)

Please refer to the dataset's original page for its licensing and usage terms.

## 🎯 Project Goals

- Explore natural language processing and sentiment analysis.
- Train and use a machine learning classifier.
- Integrate a Python ML backend with a JavaScript-based application.
- Learn how machine learning can be applied to real-world text data.