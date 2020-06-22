import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
import User from '../models/User'

interface decodedUser{
  user: {
    id:string;
    username:string;
  },
  iat: number,
  exp:number
}
export default function(req: Request, res: Response, next: NextFunction) {
  // Verify token
  try {
    const token = req.header('x-auth-token')
    console.log(token)
    // Check if not token
    if (!token) {
      return res.status(401).json({ msg: 'You need a token!' });
    }
  
    jwt.verify(token, keys.secretOrKey, async (error: any, decoded: decodedUser) => {
      if (error) {
          console.log(error);
        res.status(401).json({ msg: 'Invalid Token!' });
      } else {
        let user = await User.findOne({ _id: decoded.user.id });
        if(!user) return res.status(401).json({ msg: 'Invalid User!' });
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};