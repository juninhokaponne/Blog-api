const { response } = require("express");
const Isemail = require("isemail");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(req, res) {
    
    const { email,password,displayname } = req.body;
    const { id } = req.params;
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
        email: email
      }
    });

    if(userExist === null){
      return res.status(400).json({
        message: 'Campos inválidos'
      })
    }

    const idUserexist = userExist.dataValues.id;
    

    !email ? res.status(400).json({ message:`"\email\" is required!`}) : false;

    if (password !== userExist.password)
      return res.status(200).json({ message: "User or password is wrong!" });

    const token = jwt.sign({ idUserexist },
      "0JwcqGwX0uBVAfbUqRLpE2gefr6hSw7tOnNdLrr9o3Tt2wKfLU",
      {
        //  expiresIn: 600 // 10 min
        expiresIn: "2d", // 10 min
      }
    );

    res.status(200).json({
      token: token 
    });


  },
};
