const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });  
const doc = {
  info: {
    title: 'BMI API',
    description: 'API documentation for BMI server',
  },
  host: `${process.env.SERVER_HOST}:${process.env.PORT_SERVER}`,
  schemes: ['http'], 
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index');
});
