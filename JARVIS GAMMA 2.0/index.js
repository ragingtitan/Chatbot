//This is the server side of the application and is responsible for requesting to the gemini api.
//All the required initializations, variables and required dependencies.
let con=require('./connector')
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY='AIzaSyDw5Bu6_9erfCIF1BMMVMUIo8E3QI6yLk0';
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON bodies
let tableName='newchat';
const port = 8000;

app.use(express.static(path.join(__dirname, 'public')));

function getTableNames(callback) 
{
    con.connect((err) => {
        if (err) {
            callback(err, null);
        } else {
            //console.log("Connected to the database");
            let query = `SHOW TABLES;`;
            con.query(query, (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    //console.log(result);
                    const tableNames = result.map(row => Object.values(row)[0]);
                    callback(null, tableNames);
                }
            });
        }
    });
}

// Example usage:
function highlightSyntax(code) {
    if (code.startsWith('```') && code.endsWith('```')) {
        // Define regular expressions for different token types
        const keywordRegex = /\b(class|function|if|else|for|while|return)\b/g;
        const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g;
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        const numberRegex = /\b\d+(\.\d+)?\b/g;
        const operatorRegex = /[\+\-\*\/=<>]/g;
        const builtinRegex = /\b(console|print|printf)\b/g;
        const punctuationRegex = /[\(\){}\[\];,:]/g;

        // Apply syntax highlighting using spans with appropriate classes
        code = code.replace(keywordRegex, '<span class="keyword">$&</span>');
        code = code.replace(commentRegex, '<span class="comment">$&</span>');
        code = code.replace(stringRegex, '<span class="string">$&</span>');
        code = code.replace(numberRegex, '<span class="number">$&</span>');
        code = code.replace(operatorRegex, '<span class="operator">$&</span>');
        code = code.replace(builtinRegex, '<span class="builtin">$&</span>');
        code = code.replace(punctuationRegex, '<span class="punctuation">$&</span>');

        return code;
    }
    return code;
}
//This function converts markdown syntax to normal text format
function formatText(text) {
    var showdown  = require('showdown'),
    converter = new showdown.Converter(),
    text      = text,
    html      = converter.makeHtml(text);

    return highlightSyntax(html);
}

//This function stores the requested data in the database.
function storeData(prompt,response,sidebardata)
{
    con.connect((err)=>{
        if(err) throw err;
        else{
            //console.log("Connected to the database");
            let query=`INSERT INTO ${tableName}(prompt,response,sidebardata) values(?,?,?)`
            con.query(query, [prompt,response,sidebardata], (err, result)=>{
                if(err) throw err;
                else{
                    //console.log(result);
                }
            })
        }
    })
}
//This function provides the summary to be shown in the sidebar
function summarizer(text) {
    // Split the string into an array of words
    const words = text.trim().split(/\s+/);
    
    // Extract the first four words
    const firstFourWords = words.slice(0, 4).join(' ');
    
    return firstFourWords;
}

//This function fetches all the previous conversations in the chat
function loadPreviousData(callback) {
    con.connect((err) => {
        if (err) {
            callback(err, null);
        } else {
            //console.log("Connected to the database");
            let query = `SELECT * FROM ${tableName}`;
            con.query(query, (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    //console.log(result);
                    const data = result.map(item => ({
                        prompt: item.prompt,
                        response: formatText(item.response),
                        sidebardata: item.sidebardata
                    }));
                    callback(null, data);
                }
            });
        }
    });
}
//This function gathers all the previous conversations to be passed to the bot inorder to give context
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

        const query = `SELECT * FROM ${tableName}`;
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
            data += `You: ${'\n'+element.prompt+'\n'} JARVIS: ${'\n'+element.response+'\n'}`;
        });

        return data;
    } catch (error) {
        console.error("Error:", error);
        return ''; // Return empty string in case of error
    }
}

function createTable(name) {
    con.connect((err) => {
        if (err) throw err;
        
        const query = `CREATE TABLE ${name} (prompt VARCHAR(3000), response VARCHAR(4000), sidebardata VARCHAR(100))`;
        
        con.query(query, (err, result) => {
            if (err) throw err;
            
            console.log(`Table ${name} created successfully`);
        });
    });
    tableName=name;
}

app.post('/changeTable',(req,res)=>{
    let changedTableName=req.body.tableName;
    tableName=changedTableName;
    res.json({res:tableName});
})

app.get('/currentTable',(req,res)=>{
    res.json({res:tableName});
})

app.post('/newchat',(req,res)=>{
    let name=req.body.name;
    createTable(name);
    res.json({res:`table created!`});
})


app.get('/getprev/tables',(req,res)=>{
    getTableNames((err, tableNames) => {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Failed to previous tables.' });
        } else {
            console.log("Table names:", tableNames);
            res.status(200).json(tableNames);
        }
    });
});

//Endpoint for fetching all previous convos of the chat
app.get('/getprev', (req, res) => {
    loadPreviousData((err, data) => {
        if (err) {
            console.error("cannot load previous data Error:", err);
            res.status(500).json({ error: 'Failed to load previous data from the database' });
        } else {
            res.status(200).json(data);
        }
    });
});
//Basic endpoint to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+ '/public/index.html'));
});
//Redundant endpoint. Returns empty response.
app.post('/',(req,res)=>{
    res.end();
});
//This endpoint fetches the immediate response from the bot
app.post('/response', async (req, res) => {
    try {
        let prompt = req.body.prompt;
        //console.log("The prompt sent is " + prompt);
        const genAI = new GoogleGenerativeAI(API_KEY);
        let newPrompt = await passAlldata();
        let chat = newPrompt+`\nYou:${prompt}\nJARVIS: `;
        //console.log("All prompts"+newPrompt);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(chat);
        const response = await result.response;
        const text = await response.text();
        //console.log(text);
        storeData(prompt,text,summarizer(prompt));
        
        //Making a json element
        const jsonResponse = {
            response: formatText(text)
        };
        // Send JSON response
        res.status(200).json(jsonResponse);
    } catch (error) {
        //Throw an error
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//This starts the server at http://localhost
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});