const axios = require('axios');

async function sendAnalysis(url, text) {
    try {
        const response = await axios.post(url, { text });
        return response.data;
    } catch (error) {
        console.error('Error sending analysis request:', error);
        throw error; 
    }
}

module.exports = sendAnalysis;
