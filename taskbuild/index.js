const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userroutes = require("./routes/userroutes")
const courseroutes = require("./routes/courseroutes");
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use('/api',userroutes);
app.use('/api',courseroutes);
// Connect to MongoDB
// const password = process.env.MONGODB_PASSWORD || '';
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});