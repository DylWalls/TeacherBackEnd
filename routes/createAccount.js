const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


// Get ALL Users
router.get("/", async(req, res)=>{
    try{
        const user = await User.find();

        return res
        .send(user);
    } catch(ex){
        return res.status(500).send(`Internal Server Error:${ex}`);
    }
});


//Creating a New User(Teacher Register)
router.post("/", async (req, res) => {
    try {

    let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).send(error);
    
    const salt = await bcrypt.genSalt(10)
        user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: await bcrypt.hash(req.body.password, salt),
        });
 
        await user.save();
        const token = user.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send(user);
    
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});
   


module.exports = router;