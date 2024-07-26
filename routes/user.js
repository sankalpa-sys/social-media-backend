const router = require('express').Router();
import  validateToken from '../utils/authValidator';

const User = require('../models/User');
router.get("/user-profile", validateToken, async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        res.status(200).json(user);
    }catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router;