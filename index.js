//This is the server side of the application and is responsible for requesting to the gemini api.
let con=require('./connector')
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


function storeData(prompt,response,sidebardata)
{
    con.connect((err)=>{
        if(err) throw err;
        else{
            console.log("Connected to the database");
            let query="INSERT INTO data3(prompt,response,sidebardata) values(?,?,?)"
            con.query(query, [prompt,response,sidebardata], (err, result)=>{
                if(err) throw err;
                else{
                    //console.log(result);
                }
            })
        }
    })
}
function summarizer(text) {
    // Split the string into an array of words
    const words = text.trim().split(/\s+/);
    
    // Extract the first four words
    const firstFourWords = words.slice(0, 4).join(' ');
    
    return firstFourWords;
}


function loadPreviousData(callback) {
    con.connect((err) => {
        if (err) {
            callback(err, null);
        } else {
            console.log("Connected to the database");
            let query = "SELECT * FROM data3";
            con.query(query, (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    //console.log(result);
                    const data = result.map(item => ({
                        prompt: item.prompt,
                        response: item.response,
                        sidebardata: item.sidebardata
                    }));
                    callback(null, data);
                }
            });
        }
    });
}

async function passAlldata() {
    let data = '';

    try {
        await new Promise((resolve, reject) => {
            con.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Connected to the database");
                    resolve();
                }
            });
        });

        const query = "SELECT * FROM data3";
        const result = await new Promise((resolve, reject) => {
            con.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        result.forEach((element) => {
            data += `User: ${element.prompt}\nJ.A.R.V.I.S: ${element.response}\n`;
        });

        return data;
    } catch (error) {
        console.error("Error:", error);
        return ''; // Return empty string in case of error
    }
}


 

app.get('/getprev', (req, res) => {
    loadPreviousData((err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load previous data from the database' });
        } else {
            res.status(200).json(data);
        }
    });
});

app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname+ '/public/index.html'));
});

app.post('/',(req,res)=>{
    
});

app.post('/response', async (req, res) => {
    try {
        let prompt = req.body.prompt;
        console.log("The prompt sent is " + prompt);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const newPrompt = await passAlldata();
        //console.log("All prompts"+newPrompt);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(newPrompt+`\nUser:${prompt}\n`);
        const response = await result.response;
        const text = await response.text();
        //console.log(text);
        storeData(prompt,text,summarizer(prompt));
        //Making a json element
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
  