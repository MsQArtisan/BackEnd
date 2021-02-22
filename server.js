//"use strict";
require('dotenv').config();
var port = process.env.PORT || 5000;
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var config = require('./src/config/config');
var cors = require('cors');
var app = express();
const path = require('path');
const Pusher = require('pusher');
const cookieParser = require('cookie-parser');
const server = require('http').createServer(app);

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

//app.use(morgan('dev'));

// For Pusher
const pusher = new Pusher({
    appId: "1106641",
    key: "9d4e34bbed57dbddf921",
    secret: "cc0d97cef7e12f74943c",
    cluster: "ap1",
    useTLS: true
});

 //app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
var DIR = './uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


app.post('/api/upload', upload.array('image[]'), (req, res, next) => {
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});


var messages = [];
app.post('/api/messages', (req, res) => {
    messages.push(req.body);
    pusher.trigger('chat', 'message', messages);
    res.send(messages);
});

app.get('/api/allMessages', (req, res) => {
    res.send(messages)
})
app.get('/' ,(req,res)=>res.send("Server is running..."));

var routes = require('./src/routes');
app.use('/api', routes);

mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Start the server
server.listen(port);
console.log('MsQArtisan is running on port :' + port);

