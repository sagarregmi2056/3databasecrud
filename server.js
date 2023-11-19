require('dotenv').config();


const express = require('express');
// import { Db } from './node_modules/mongodb/src/db';
const app = express();

const session = require('express-session');


const mongoose = require('mongoose');

const PORT = process.env.PORT||5550

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:"My secret key",
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
    res.locals.message= req.session.message;
    delete req.session.message;
    next();

})
app.use(express.static("uploads"));

app.set('view engine',"ejs");
// creating connection to the db 
const db1 = mongoose.createConnection("mongodb://localhost:27017/databaseone")
const db2 = mongoose.createConnection("mongodb://localhost:27017/database2")

// creating schema and model 
// const Name = db1.model("names",mongoose.Schema({name:String}));
// const Email = db2.model("emails",mongoose.Schema({email:String}));
const createAdminModel = require('./models/imageModel');
const createUserModel = require('./models/userModel');


const Admin = createAdminModel(db1);
const User = createUserModel(db2);



app.use('',require("./routes/routes"))
app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
})


