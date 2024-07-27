from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/analyze/")
def analyze_sentiment(input: TextInput):
    analysis = TextBlob(input.text)
    sentiment = {
        "polarity": analysis.sentiment.polarity,
        "subjectivity": analysis.sentiment.subjectivity
    }
    return sentiment

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sentiment Analysis API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)