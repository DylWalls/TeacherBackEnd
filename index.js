const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const cors = require('cors');

//Routes go here
const authUser = require('./routes/authUser');
const users = require('./routes/accounts');

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/authUser', authUser);
//API endpoint

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.log(`Server started on port: ${port}`);
});