import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import auth from "../../middleware/auth"
import jwt from 'jsonwebtoken';
const keys = require("../../config/keys");
import validateLoginInput from "../../validation/login";
import User from '../../models/User';

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

export default router