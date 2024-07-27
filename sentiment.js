const mongoose = require('mongoose');
const axios = require('axios');
const Task = require('./model/Task'); // Adjust the path as needed
const connectDB = require('./db/connect')
require('dotenv').config()

const sendSentimentValue = async(url, baseText) =>{
    try {
        await connectDB(process.env.MONGO_URI)

        const diaries = await Task.find().exec();

        const allJournals = diaries.map(diary => diary.journal).join(' ');

        const combinedText = `${baseText} ${allJournals}`;
        console.log(combinedText)

        const response = await axios.post(url, { text: combinedText });

        return response.data;
    } catch (error) {
        console.error('Error processing request:', error);
        throw error; 
    } finally {
        mongoose.connection.close();
    }
}

module.exports = sendSentimentValue

