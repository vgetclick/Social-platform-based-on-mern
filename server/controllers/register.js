import bcrypt from 'bcrypt';
import User from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();

export const register = async(req,res) => {
    const {username,password} = req.body;
    try{
        const existUser = await User.findOne({username});
        if(existUser)return res.status(400).json({message:'用户名已经存在,请另外取一个'});
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username,password:hashedPassword});
        await newUser.save();
        res.json({message:'注册成功'});
    }
    catch(err){
        res.status(500).json({ message: '服务器错误' });
    }
};