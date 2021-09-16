const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const User = require('./models/usercreation');

connectDB();

app.use(express.json());
app.use('/api/users', User);

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.log(`Server started on port: ${port}`);
});