//This is the server side of the application and is responsible for requesting to the gemini api.
//All the required initializations, variables and required dependencies.
let con=require('./connector')
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const path = require('path');
const session=require("express-session");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON bodies
let tableName='newchat';
const port = 8000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '24411',
    resave: false,
    saveUninitialized: true
}));



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



app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname+ '/public/signin.html'));
});



app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname+ '/public/signup.html'));
});



app.post('/signin', (req, res) => {
    let email = req.body.Email;
    let password = req.body.Password;

    con.connect((err) => {
        if (err) throw err;
        else {
            let query = 'SELECT * FROM authentication WHERE Email = ? AND Password = ?';
            con.query(query, [email, password], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    req.session.isLoggedIn = true;

                    // Set a cookie to indicate user's login status
                    res.cookie('loggedIn', true, { maxAge: 900000, httpOnly: false });

                    res.redirect('/')
                } else {
                    res.status(401).send(`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Login Failed</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"> <!-- Include Tailwind CSS -->
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center h-screen">
                        <div class="text-center">
                            <h1 class="text-3xl font-semibold mb-4">Login Failed</h1>
                            <p class="text-lg text-red-600 mb-8">The provided credentials do not match. Please try again.</p>
                            <a href="/signin" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Try Again</a> <!-- Link to the login page -->
                        </div>
                    </body>
                    </html>
                    `);
                }
            });
        }
    });
});



app.post('/signup', (req, res) => {
    let username=req.body.Username;
  let email=req.body.Email;
  let password=req.body.Password;

  con.connect(function(error){
    
    if(error) throw error;
    let flag2=0;
    let query2='SELECT * FROM authentication'
        con.query(query2,(err,res2)=>{
        res2.forEach(item => {
          // Accessing properties of each object
          if (item.Username==username && item.Email == email) {
            flag2 = 1;
          }
        });
        if (flag2 == 1) {
          res.send('User already exists! Redirect to <a href="/">Home</a>');
        } else {
          let query = "INSERT INTO authentication(Username,Email,Password) VALUES(?,?,?)"
          con.query(query,[username,email,password],(error,res1)=>{
          if(error) throw error;
          else{
          }
        });
        res.send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Successful</title>
            <!-- Include Tailwind CSS -->
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <!-- Include custom styles -->
            <style>
                /* Add your custom styles here */
            </style>
            <!-- Redirect to target page after 5 seconds -->
            <meta http-equiv="refresh" content="5;url=/signin">
        </head>
        
        <body class="bg-gray-100 flex items-center justify-center h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg">
                <h1 class="text-3xl font-semibold text-gray-800 mb-4">Registration Successful!</h1>
                <p class="text-lg text-gray-600 mb-4">Thank you for registering. You will be redirected shortly.</p>
                <a href="login.html" class="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-block">Log In</a>
                <p class="text-center w-full">Redirecting to login page</p>
            </div>
        </body>
        
        </html>
        `);

        }
      });
  });
})



//Redundant endpoint. Returns empty response.
app.post('/',(req,res)=>{
    res.end();
});



app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500);
        } else {
            // Clear the authentication cookie
            res.clearCookie('loggedIn');
            // Redirect the user to the login page
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Logout</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"> <!-- Include Tailwind CSS -->
            </head>
            <body class="bg-gray-100 flex items-center justify-center h-screen">
                <div class="text-center">
                    <h1 class="text-3xl font-semibold mb-4">You have been successfully logged out</h1>
                    <p class="p-2 text-lg text-gray-700 mb-8">Thank you for using Jarvis. You have been logged out of your account. You can login again by clicking the button below.</p>
                    <div class="flex flex-col items-center">
                        <a href="login.html" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Login</a> <!-- Link to the login page -->
                        <a class="text-blue-600 font-semibold" href="/">Home</a>
                    </div>
                </div>
            </body>
            </html>
            `);
        }
    });
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
