const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const os = require('os');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });  
// console.log('MONGO_USERNAME:', process.env.MONGO_USERNAME);
// console.log('MONGO_PASSWORD:', process.env.MONGO_PASSWORD);
console.log('MONGO_CLUSTER:', process.env.MONGO_CLUSTER);
console.log('MONGO_DB:', process.env.MONGO_DB);
// MongoDB URI
// const mongoURI = `mongodb://${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?authSource=admin`;
const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}`;
// const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?authSource=admin`;
const connection = mongoose.createConnection(mongoURI).on('open'
    ,()=>{console.log("MongoDB Connected");
    const networkInterfaces = os.networkInterfaces();
    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
      for (const interfaceInfo of interfaces) {
        if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
          console.log(`Interface: ${name}`);
          console.log(`Address port: ${interfaceInfo.address}`);
          process.env.SERVER_HOST = interfaceInfo.address;
        }
      }
    }
    }).on('error',()=>{
    console.log("MongoDB Connection error");
});
module.exports = connection;