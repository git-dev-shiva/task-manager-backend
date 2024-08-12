require('dotenv').config();
const {default:mongoose}=require('mongoose');

async function getConnection(){
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = getConnection;