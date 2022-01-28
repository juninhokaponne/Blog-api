const { response } = require("express");
const Isemail = require("isemail");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(req, res) {
    
    const { email,password,displayname } = req.body;
    const user = { name: displayname };

    if(!email && !password){
      return res.status(400).json({
        message: `"\email\" and "\password\" is required.`
      })
    }

    if (!password){ return res.status(400).json({ message: `"\Password\" is required!` });}
    if (email === "") { return res.status(400).json({ message: `"\email\" is not allowed to be empty` }); }
    if (password === "") { return res.status(400).json({ message: `"\password\" is not allowed to be empty` });}
    Isemail.validate("test@iana.org", { errorLevel: true });
    if (!Isemail.validate(email)) {return res.status(400).json({ message: `"\email\" must be a valid email" ` });}

    const userExist = await User.findOne({
      attributes: ['id','email','password'], 
      where: {
        email: req.body.email
      }
    });

    if(userExist === null){
      return res.status(400).json({
        message: 'Incorrect username or password.'
      })
    }

    !email ? res.status(400).json({ message:`"\email\" is required!`}) : false;

    if (password !== userExist.password)
      return res.status(200).json({ message: "User or password is wrong!" });

    const accessToken = jwt.sign(user, " " + process.env.ACCES_TOKEN_SECRET);

    res.status(200).json({
      accessToken: accessToken 
    });


  },
};
