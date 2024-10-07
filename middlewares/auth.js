const jwt = require("jsonwebtoken");
const userModel = require("../src/models/user.model");


const auth = async (req, res, next) => {
    //getting token from headers and splitting it by the space and accessing 1st index element
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).send("Acess denied no token provided!")
    }

    try {
        //verifying the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = await userModel.findById(decoded._id)
        next();
    } catch (err) {
        res.status(400).send("Invalid Token!")
    }
}

module.exports = auth