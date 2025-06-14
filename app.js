require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const route = require('./routes/route');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/', route);

// Serve addSchool form
app.get('/addSchool', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
