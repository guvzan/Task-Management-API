import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";


const setUser = async (req) => {
    try{
        const cookie = req.headers?.cookie;
        if(!cookie) return;
        const jwtData = jwt.verify(cookie.slice(4), process.env.JWT_SECRET);
        if(!jwtData) return;
        req.user = await User.findById(jwtData.userId) || null;
    }catch(e){
        console.log(`Error when reading jwt token: ${e}`);
    }
}

const notAuthorized = async (req, res) => {
    res.writeHead(401, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify({message: 'Sign in to access this content!'}));
}

const filterAllowedTasks = (user, tasks) => {
    if(user.role === 'admin') return tasks;
    return tasks.filter(task => {
        return task.createdBy.toHexString() === user.id;
    });
}

const isTaskCreatedByUser = (task, user) => {
    if(user.role === 'admin') return true;
    return task.createdBy.toHexString() === user.id;
}

export {
    setUser,
    notAuthorized,
    filterAllowedTasks,
    isTaskCreatedByUser
}