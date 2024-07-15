const express = require('express');
const {EventEmitter} = require('events');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const winston = require('winston');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./src/config/db');
require('dotenv').config();
const app = express();

const port = 3030;

app.use(express.json());

const eventEmiiter = new EventEmitter();

const swaggerOptions = {
 defination:{
    info:{
        title: 'Online Bookstore API',
        version: '1.0.0',
    },
},

apis:['./routes/*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports:[
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
})

sequelize.sync();
mongoose.connect('mongodb://127.0.0.1:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


const server = require('http').createServer(app);
const io = socketIo(server);

io.on('connection', (socket) =>{
    console.log('user is connected');
    socket.on('disconnect', () =>{
        console.log('user disconnected');
    })
})

eventEmiiter.on('orderPlaced', (order) =>{
    console.log('Order Placed:', order);
    io.emit('orderStatusChanged', order);
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'shreyakushwaha40@gmail.com',
        pass: 'savu crph mmyx lmgq',
    }
})

cron.schedule('0 0 * * 0', () =>{
    console.log('Sending promotional emails');
})

app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));
app.use('/books', require('./routes/books'));
app.use('/reviews', require('./routes/reviews'));



server.listen(port, () =>{
        console.log(`Server is running at port ${port}`);
})