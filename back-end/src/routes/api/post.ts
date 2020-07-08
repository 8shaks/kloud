import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validatePostInput from "../../validation/post";
import Profile from '../../models/Profile';
import Post from '../../models/Post';
import { IPost, IProfile } from "../../@types/custom"

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post( '/', auth, async (req, res) => {
    if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      const newPost = new Post({
        description: req.body.description,
        title: req.body.title,
        username:req.user.username,
        genre:req.body.genre,
        user: req.user.id
      });
      const profile = await Profile.findOne({user:req.user.id});
      if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
      profile?.posts.push(newPost._id)
      await profile?.save();
      const post = await newPost.save();
      console.log(post)
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @route    POST api/posts/edit
// @desc     edit a post
// @access   Private
router.post( '/edit', auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    let newPost = await Post.findOneAndUpdate(
      { _id: req.body.id },
      { $set: {title:req.body.title, description:req.body.description} },
      { new: true, upsert: true }
    );

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);

// @route    GET api/posts/user/[id]
// @desc     Get all posts for a user
// @access   Private
function getMyPosts(profile:IProfile):Promise<any>{
  return new Promise<IPost[]>((resolve, reject) => {
    let myPosts:IPost[] = [];
    profile!.posts.forEach(async (postId) => {
      let post = await Post.findById(postId);
      if (post)
        myPosts.push(post);
      if (myPosts.length === profile!.posts.length)
        resolve(myPosts);
    });
  });
}

router.get('/user/:id', async (req, res) => {
  // if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
  try {
    const profile = await Profile.findOne({user:req.params.id});
    if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
    getMyPosts(profile).then((myPosts)=>{
      return res.json(myPosts)
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id',  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json({errors: { post: 'We coulc not find the post you wanted to delete' }});
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

export default router;