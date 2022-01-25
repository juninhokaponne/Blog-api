const { response } = require("express");
const Isemail = require("isemail");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(req, res) {
    const { displayname, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: `"\email\" is required!` });
    }
    if (!password) {
      return res.status(400).json({ message: `"\Password\" is required!` });
    }
    if (email === "") {
      return res
        .status(400)
        .json({ message: `"\email\" is not allowed to be empty` });
    }
    if (password === "") {
      return res
        .status(400)
        .json({ message: `"\password\" is not allowed to be empty` });
    }

    Isemail.validate("test@iana.org", { errorLevel: true });
    if (!Isemail.validate(email)) {
      return res
        .status(400)
        .json({ message: `"\email\" must be a valid email" ` });
    }

    const displayName = req.body.displayname;
    const user = { name: displayname };

    const accessToken = jwt.sign(user, " " + process.env.ACCES_TOKEN_SECRET);

    res.json({ accessToken: accessToken });

    const users = await User.findAll({
      attributes: ["email", "password"],
    });

    if (email && password === users) {
      return res.status(200).json({ message: "Usuário logado com sucesso!" });
    } else {
      return res.status(400).json({ message: "Falha ao tentar fazer login!" });
    }
  },
};
