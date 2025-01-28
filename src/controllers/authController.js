import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = (req, res) => {
    try{
        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });
        req.on('end', async () => {
            body = JSON.parse(Buffer.concat(body).toString());
            const {username, password} = body;
            let user = await User.findOne({username});
            if(user){
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: `User with username ${username} already exists`}));
            }
            const hashedPassword = bcrypt.hashSync(password, 7);
            user = await User.create({username, password: hashedPassword});

            const jwtToken = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );

            res.writeHead(201, {
                'Content-Type': 'application/json',
                'Set-Cookie': `jwt=${jwtToken}; Secure; HttpOnly; SameSite=Strict`
            });
            return res.end(JSON.stringify({message: 'success', user}));
        });
    }catch (e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: `Error while registrating new user: ${e}`}));
    }
}

const loginUser = (req, res) => {
    console.log('Dummy for loginUser');
}

export {
    registerUser,
    loginUser
}