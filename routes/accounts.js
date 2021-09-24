const { User, validateUser, Child, validateChild, Activity, validateActivity} = require('../models/user');
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

//Get User by ID(TeacherID)
router.get('/:userId', async(req,res)=>{
    try{
        const users = await User.findById(req.params.userId);
        if (!users) return res.status(400).send(`The User with ID of "${req.params.user}" does not exist.`);
        
        return res
        .send(users);
    } catch(ex){
        return res.status(500).send(`Internal Server Error:${ex}`);
    }
})


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

// Updating User Account  
router.put("/:userId", auth, async (req, res) =>{
    try {
        const { error } = validateUser(req.body);
            if (error) return res.status(400).send(error);

            const salt = await bcrypt.genSalt(10)
        let user = await User.findByIdAndUpdate(req.params.userId,{
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: await bcrypt.hash(req.body.password, salt),
        },
            {new: true}
        );
        if (!user)
        return res
            .status(400)
            .send(`The User with ID of "${req.params.userId}" does not exist`);

        await user.save();
        const token = user.generateAuthToken();

        return res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .send({_id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: this.isAdmin});
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
});

// Deleting User(Teacher)
router.delete('/:userId', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        if(!user)
            return res.status(400).send(`The User with ID of "${req.params.userId}" does not exist.`);
        return res.send(user);       
    } catch(ex){
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//Child Routes

//Get Entire Classroom
router.get("/:userId/children", async (req, res)=>{

    try {
        const child = await Child.find();
        return res.send(child);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Adding Children to TeacherClassroom
router.post("/:userId/children", async(req, res)=>{
    try {
        const user = await User.findById(req.params.userId);
        if(!user)
            return res
                .status(400)
                .send(`The User with Id of "${req.params.userId}" does not exist.`);
                let child = new Child({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    allergies: req.body.allergies,
                   glasses: req.body.glasses,
                   stock: req.body.stock
                });
        user.children.push(child);
        await user.save();
        return res.send(user.children);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Deleting a Child from Teacher
router.delete("/:userId/children/:childrenId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user)
        return res
          .status(400)
          .send(`The user with id "${req.params.userId}" does not exist.`);
      let children = user.children.id(req.params.childrenId);
      if (!children)
        return res
          .status(400)
          .send(
            `The Child with id of "${req.params.childrenId}" does not exist.`
          );
      children = await children.remove();
      await user.save();
      return res.send(children);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  }); 


// Routes for Activities

//Get Activity
router.get("/:userId/activities/:activitiesId", async (req, res)=>{

    try {
        const activity = await Activity.find();
        return res.send(activity);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Creating Activity
router.post("/:userId/activities", async(req, res)=>{
    try {
        const user = await User.findById(req.params.userId);
        if(!user)
            return res
                .status(400)
                .send(`The User with Id of "${req.params.userId}" does not exist.`);
            let activity = new Activity({
                eventName: req.body.eventName,
                date: req.body.date,
                location: req.body.location,
                eventAct: req.body.eventAct,
            });
        user.activities.push(activity);
        await user.save();
        return res.send(activity);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Updating activity
router.put("/:userId/activities/:activitiesId", async (req, res) =>{
    try {
        const { error } = validateActivity(req.body);
            if (error) return res.status(400).send(error);

        const user = await User.findById(req.params.userId);
        if (!user)
          return res
            .status(400)
            .send(`The user with id "${req.params.userId}" does not exist.`);    

        let activity = user.activities.findByIdAndUpdate(req.params.activitiesId,{
            eventName: req.body.eventName,
            date: req.body.date,
            location: req.body.location,
            eventAct: req.body.eventAct,
        },
            {new: true}
        );
        if (!activity)
        return res
            .status(400)
            .send(`The Activity with ID of "${req.params.activitiesId}" does not exist`);
        await user.save();
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
});
//Delete Activity
router.delete("/:userId/activities/:activitiesId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user)
        return res
          .status(400)
          .send(`The user with id "${req.params.userId}" does not exist.`);
      
          let activity = user.activities.id(req.params.activitiesId);
      if (!activity)
        return res
          .status(400)
          .send(
            `The Activity with id of "${req.params.activitiesId}" does not exist.` 
        );

        activity = await activity.remove();
        await user.save();
        return res.send(activity);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  }); 



module.exports = router;