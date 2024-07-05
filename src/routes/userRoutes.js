const user = require("../controllers/user");
const routes = require("express").Router();
const verifyAccessToken = require("../helper/utils/verifyAccessToken")
routes.get("/test", async (req, res) => {
    console.log("user");
    res.send("user working");
});


routes.post("/login", user.login);
routes.post("/signup", user.signup);
routes.get("/confirm/:token", user.confirmEmail);
module.exports = routes;
