const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY='AIzaSyDw5Bu6_9erfCIF1BMMVMUIo8E3QI6yLk0';
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON bodies

const port = 8000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+ '/public/index.html'));
});

app.post('/response', async (req, res) => {
    try {
        let prompt = req.body.prompt;
        console.log("The prompt sent is " + prompt);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
        const jsonResponse = {
            response: text
        };
        // Send JSON response
        res.status(200).json(jsonResponse);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
  });
  