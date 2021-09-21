const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');


//Generic Get
router.get("/", async (req, res)=>{

    try {
        const users = await User.find();
        return res.send(users);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Creating Children to Classroom
router.post("/", async(req, res) =>{
    try {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = await User.findOne({firstName: req.body.firstName});
        if (user) return res.status(400).send("Child is already in your class!");
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        await user.save();
        const token = user.generateAuthToken();
        return res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .send({_id:user._id, firstName:user.firstName, lastName:user.lastName})
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

//Adding Children to TeacherClassroom
router.post("/:userId/children/:childrenId", auth, async(req, res)=>{
    try {
        const user = await User.findById(req.params.userId);
        if(!user)
            return res
                .status(400)
                .send(`The User with Id of "${req.params.userId}" does not exist.`);
        const children = await children.findById(req.params.childrenId);
        if(!children)
            return res
                .status(400)
                .send(`The Child with Id of "${req.params.childrenId}" does not exist.`)
        user.children.push(children);
        await user.save();
        return res.send(user.children);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Updating Child
router.put("/:userId/children/childrenId", auth, async (req, res) =>{
    try {
        const {error} = validate(req.body);
            if(error) return res.status(400).send(error);
        const user = await User.findById(req.params.userId);
            if(!user)
                return res
                    .status(400)
                    .send(`The User with Id of "${req.params.userId}" does not exist.`);
        const children = await children.findById(req.params.childrenId);
            if(!children)
                return res
                    .status(400)
                    .send(`The Child with the Id of "${req.params.childrenId}" does not exist.`);
        user.children.push(children);
        await user.save();
        return res.send(user.children);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Deleting a Child from Teacher
router.delete("/:userId/children/:childrenId", auth, async (req, res) => {
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

// Generic Delete
router.delete("/", async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      if (!user)
        return res
          .status(400)
          .send(`The user with id "${req.params.id}" does not exist.`);
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  }); 

  module.exports = router;