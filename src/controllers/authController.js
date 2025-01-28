import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import {signJWTToken} from "../utils/authUtils.js";

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
            const jwtToken = signJWTToken({userId: user._id});
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
    try{
        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });
        req.on('end', async () => {
            body = JSON.parse(Buffer.concat(body).toString());
            const {username, password} = body;
            const user = await User.findOne({username});
            if(!user){
                res.writeHead(404, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: `User with username "${username}" not found!`}));
            }
            const userHashedPassword = user['password'];
            const passwordMatch = bcrypt.compareSync(password, userHashedPassword);
            if(!passwordMatch){
                res.writeHead(401, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: 'Passwords don\'t match'}));
            }
            const jwtToken = signJWTToken({userId: user['_id']});
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': `jwt=${jwtToken}; Secure; HttpOnly; SameSite=Strict`
            });
            return res.end(JSON.stringify({message: 'success', user}));
        });
    }catch (e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: `Error while logging in: ${e}`}));
    }
}

export {
    registerUser,
    loginUser
}