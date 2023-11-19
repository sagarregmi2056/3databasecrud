// userModel.js
const mongoose = require('mongoose');

const createUserModel = (db2) => {
    const UserSchema = new mongoose.Schema({
        name:{
            type: String,
            required:true
        },
        email:{
            type:String,
            required:true,

        },
        phone:{
            type:String,
            required:true

        },
        created:{
            type:Date,
            required:true,
            default:Date.now,
        },
        
    });

    // Creating a model using the schema and the db2 connection
    return db2.model("User", UserSchema);
};

module.exports = createUserModel;
