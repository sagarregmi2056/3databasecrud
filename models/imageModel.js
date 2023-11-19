// adminModel.js
const mongoose = require('mongoose');

const createAdminModel = (db1) => {
    const AdminSchema = new mongoose.Schema({
        image:{
            type:String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
        
    });

    // Creating a model using the schema and the db1 connection
    return db1.model("Admin", AdminSchema);
};

module.exports = createAdminModel;
