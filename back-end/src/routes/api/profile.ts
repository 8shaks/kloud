import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateProfileInput from "../../validation/profile";
import Profile from '../../models/Profile';


// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ date: -1 });
    return res.json(profiles)

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({errors: { server: 'Server error' }});
  }
});

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    let user = req.user!
    const profile = await Profile.findOne({user:user.id});
    if (!profile) {
      return res.status(400).json({errors: { profile: 'There is no profile for this user' }});
    }
    // only populate from user document if profile exists
    return res.json(profile)
    // res.json(profile.populate('user'));
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({errors: { server: 'Server error' }});
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post('/', auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  let user = req.user
  const { bio, social, credits, friendRequestsRecieved, friendRequestsSent } = req.body;

  let profileFields = {
    user:user.id,
    username:user.username,
    bio,
    credits,
    social,
    friendRequestsRecieved,
    friendRequestsSent
  };
    const { errors, isValid } = validateProfileInput(profileFields);
    if (!isValid) {
      return res.status(400).json(errors);
    }
   
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/user/:id',
  async ({ params: { id } }, res) => {
    try {
      const profile = await Profile.findOne({user:id});
      
      if (!profile) return res.status(404).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);
// @route    GET api/profile/user/:username
// @desc     Get profile by username
// @access   Public
router.get(
  '/username/:username',
  async ({ params: { username } }, res) => {
    try {
      const profile = await Profile.findOne({username:username});
      
      if (!profile) return res.status(404).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);



// // @route    DELETE api/profile
// // @desc     Delete profile, user & posts
// // @access   Private
// router.delete('/', auth, async (req, res) => {
//   try {
//     // Remove user posts
//     await Post.deleteMany({ user: req.user.id });
//     // Remove profile
//     await Profile.findOneAndRemove({ user: req.user.id });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.user.id });

//     res.json({ msg: 'User deleted' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });



export default router