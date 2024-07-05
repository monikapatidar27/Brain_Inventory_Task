const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose
        .connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
        })
        .then(() =>{
            console.log("Db Connection Successful");
        })
        .catch((err) => {
            console.log("Db not connected", err);
        });
}

module.exports = dbConnect;