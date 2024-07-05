const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const dbConnect = require("./database/dbConnect.js");
const userRoutes = require("./src/routes/userRoutes.js")

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dbConnect();


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});
app.use("/api/v1/user", userRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});