const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+ '/public/index.html'));
});

app.post('/',(req,res)=>{
    let prompt=req.body;
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
  });
  