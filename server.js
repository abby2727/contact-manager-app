const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// app.use are known as middleware
app.use('/api/contacts', require('./routes/contactRoutes'));

app.listen(port, () => console.log(`Server started on port ${port}`));