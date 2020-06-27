import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import User from '../../models/User'
import validateRegisterInput from "../../validation/register"
import Profile from '../../models/Profile'


// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      console.log(errors)
      return res.status(400).json({errors:errors});
    }
    const { username, email, password} = req.body;

    try {
      let userEmail = await User.findOne({ email });
      
      if (userEmail) {
        return res
          .status(400)
          .json({ errors: { email: 'Email already exists' } });
      }
      let userNameSearch = await User.findOne({ username });
      if (userNameSearch) {
        return res
          .status(400)
          .json({ errors: { username: 'Username already exists' }});
      }

      let user = new User({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      let profile = new Profile({
        user:user._id,
        username: user.username,
        social:{}
      });
      await profile.save();
      return res.json({success:'Succesfully created User', user});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router