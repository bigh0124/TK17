const express = require('express');
require('./db/mongoose');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoute);

//handle error
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is up on ${PORT}`);
});