const mongoose = require('mongoose');
const Joi = require ('joi');
const config = require('config');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
    firstName:  { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName:  { type: String, required: true, minlength: 2, maxlength: 50 },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    isAdmin: {type: Boolean, default: false},
});


userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.userName , isAdmin: this.isAdmin}, config.get('jwtSecret'));
};


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(user);
}
  

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.userSchema = userSchema;