const app = require('./app');
const db = require('./configs/db')
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });  

require('./services/cronJobs'); 

app.get('/', (req, res) => {
    res.send("bmi server");
});

app.listen(process.env.PORT_SERVER, () => {
    console.log(`Server listening on Port http://localhost:${process.env.PORT_SERVER}`);
});