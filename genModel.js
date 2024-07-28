const mongoose = require('mongoose');
const Task = require('./model/Task');
const connectDB = require('./db/connect')
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const bodyAcc = async() =>{
    try {
        await connectDB(process.env.MONGO_URI)

        const diaries = await Task.find().exec();

        const allJournals = diaries.map(diary => diary.journal).join(' ');

        const combinedText = `${allJournals}`;

        return combinedText
    } catch (error) {
        console.error('Error processing request:', error);
        throw error; 
    } finally {
        mongoose.connection.close();
    }
}

async function run() {
    const prompt = await bodyAcc()
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel(
        { 
        model: "gemini-1.5-flash" , 
        generationConfig: { responseMimeType: "application/json" },
        systemInstruction: "You are a therapist and advice the person based on his/her description",
        }
    );
  
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  }
  
  run()

  module.exports = run