const mongoose = require('mongoose');
const keys = require('../config/keys');

async function main() {
    await mongoose.connect(keys.mongodb,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
}

main().catch(err => console.log(err));
