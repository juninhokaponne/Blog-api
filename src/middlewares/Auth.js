const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const config = process.env;

module.exports = {
    eAdmin: async function (req, res, next){
      const authHeader = req.headers.authorization;
      if(!authHeader){
        return res.status(401).json({
          message: 'Token is required.'
        });
      }
      const [, token] = authHeader.split(' ');

      if (!token) {
        res.status(401).json({
          message: 'Token não encontrado',
        })
      }

      try {
        const decode = await promisify(jwt.verify)(token, '0JwcqGwX0uBVAfbUqRLpE2gefr6hSw7tOnNdLrr9o3Tt2wKfLU')
        req.userId = decode.idUserexist
        return next();
      } catch (error) {
        res.status(401).json({
          message: 'Token expirado ou inválido',
        })
      }
    }
}