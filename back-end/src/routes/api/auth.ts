import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import auth from "../../middleware/auth"
import jwt from 'jsonwebtoken';
const keys = require("../../config/keys");
import validateLoginInput from "../../validation/login";
import validatePwResetInput from "../../validation/pwReset";
import User from '../../models/User';
import nodemailer from 'nodemailer';
import { IUser } from '../../@types/custom';

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: keys.email,
    pass: keys.emailPassword
  }
});

// @route    GET api/auth
// @desc     Get user by token
// @access   Private

router.get('/', auth, async (req , res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', async (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ errors:  {auth:'Recheck your info and try again'  }});
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: {auth: 'Recheck your info and try again'}  });
      }
      const payload = {
        user: {
          id: user.id,
          username:user.username
        }
      };
      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 360000 },
        (err: Object, token: string) => {
          console.log(err)
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);




// @route    POST api/auth/sendpw_email
// @desc     Sends a password reset email
// @access   Public

router.post('/sendpw_email', async (req , res) => {
  try {
    let user = await User.findOne({ email:req.body.email });

    if(user){
      const payload = {
        user: {
          id: user.id,
          username:user.username
        }
      };
      jwt.sign(payload, keys.resetPassword, { expiresIn: 3600 }, (err: Object, token: string) => {
          console.log(err)
          if (err) throw err;

          user!.resetPwToken = token;
          user!.save();
          const emailResetPw = `<div>
          Hey ${user!.username}
          <br/><br/>
          You recently sent out a request to change your password. If you don't remember doing this, ignore this message.
          <br/><br/>
          However, if this was intentional, please click the link below to complete the proccess
          <br/><br/>
          <a href="https://kloud.live/reset-password/${token}">Reset password here</a>
          <br/><br/>
          From,
          The Kloud Team
          </div>`
  
        const mailOptions = {
          from: "Kloud",
          to: user!.email,
          subject: "Password Reset Request",
          //Email to Be sent
          html: emailResetPw
        };

        //Send Email
        transporter.sendMail(mailOptions, function(err, info) {
          //handle email errors
          if (err) console.log(err);
          else return res.json({sucess:true})
        });

        }
      );
     
    }else{
      // return res.status(404).json({errors:{user:"Email not found"}});
      return res.json(true)
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth/pw_reset_token/:token
// @desc     Check Pw Reset Token
// @access   Public
interface decodedUser{
  user: {
    id:string;
    username:string;
  },
  iat: number,
  exp:number
}
router.get('/pw_reset_token/:token',  async (req , res) => {
  try {
      
    jwt.verify(req.params.token, keys.resetPassword, async (error: any, decoded: decodedUser) => {
      if (error) {
        console.log(error)
        res.status(401).json({ errors:{token: 'Invalid Token!' }});
      } else {
        let user = await User.findOne({ resetPwToken:req.params.token });
        console.log(user)
        if(user) return res.json(true);
        else return res.status(404).json({errors:{token:"Invalid Token"}})
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth/reset_password
// @desc     Resets Password
// @access   Public

router.post('/reset_password', async (req , res) => {
  const { errors, isValid } = validatePwResetInput(req.body);
  if (!isValid) {
    return res.status(400).json({errors:errors});
  }
  try {
      
    jwt.verify(req.body.token, keys.resetPassword, async (error: any, decoded: decodedUser) => {
      if (error) {
        console.log(error)
        return res.status(401).json({ errors:{token: 'Invalid Token!' }});
      } else {
        let user = await User.findOne({ resetPwToken:req.body.token });
        if(user){
          if (user.resetPwToken !== req.body.token) return res.status(401).json({ errors:{token: 'You did not request a password reset!' }});
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(req.body.password, salt);
          user.resetPwToken = undefined;

          await user.save();
          const emailResetPw = `<div>
          Hey ${user.username}
          <br/><br/>
          Your password has been recently reset. If you did not do this, please contact us immediately as officialkloudmail@gmail.com.
          <br/><br/>
          From,
          The Kloud Team
          </div>`
  
        const mailOptions = {
          from: "Kloud",
          to: user.email,
          subject: "Password Reset ",
          //Email to Be sent
          html: emailResetPw
        };

        //Send Email
        transporter.sendMail(mailOptions, function(err, info) {
          //handle email errors
          if (err) console.log(err);
          else return res.json({sucess:true})
        });

        }else{
          return res.status(404).json({ errors:{ token: 'Invalid Token!' }});
        }
        return res.json(true)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router