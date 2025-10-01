const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport'); 

const swaggerDocument = require('./swagger-output.json');
const userRouters = require('./routes/user.router');
const roleRouters = require('./routes/role.router');
const DocumentRouters = require('./routes/document.router');
const authRouters = require('./routes/auth.router'); 
const ImageRouters = require('./routes/image.router');
const statisticalRouters = require('./routes/statistical.router');
const LoggerRouters = require('./routes/logger.router');

const Logger = require('./services/logger.service');
const app = express();

app.use(cors({
    // origin: [
    //     'http://localhost:3000', // Allow requests from your frontend URL
    //     // 'https://c010-2402-800-6374-dd24-1423-ceaf-a85-f49f.ngrok-free.app' // Allow requests from your ngrok URL
    // ],
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'apikey'],
  }));
  
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();

  const originalSend = res.send;
  res.send = function (body) {
    const responseTime = Date.now() - start;
    res.statusCode = res.statusCode || 200;
    const isLoggingApi = req.method === 'GET' && req.originalUrl === '/api/logger/sys';
      if (!isLoggingApi) {
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        Logger.logRequest(req.method, fullUrl, res.statusCode, responseTime);
      }
    originalSend.apply(res, arguments); 
  };
  next();
});

app.use(body_parser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/user', userRouters);
app.use('/api/role', roleRouters);
app.use('/api/document', DocumentRouters);
app.use('/api/auth', authRouters);
app.use('/api/image', ImageRouters);
app.use('/api/statistical', statisticalRouters);
app.use('/api/logger', LoggerRouters);

module.exports = app;
