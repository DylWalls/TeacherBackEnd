const {User, validateUser } = require('../models/usercreation');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');



//Creating a New User(Teacher Register)
router.post('/', async (req, res) => {
    try {

    let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).send('User already registered.');
    
    const salt = await bcrypt.genSalt(10)
        user = new User({
            name: req.body.name,
            email: req.body.email,
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