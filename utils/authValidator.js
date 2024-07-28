const jwt = require("jsonwebtoken");


const validateToken = (req, res, next) => {
    const token = req.header("auth-token")?.split(" ")[1];
    if(!token) return res.status(403).json("Access denied");
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).json("Invalid token");
    }
}

module.exports = validateToken;