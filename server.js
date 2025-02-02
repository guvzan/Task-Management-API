import http from 'http';
import 'dotenv/config.js'
import {connectToDB} from "./src/utils/dbUtils.js";
import {
    createNewTask,
    deleteTaskById,
    getAllTasks,
    getTaskById,
    updateTaskById
} from "./src/controllers/taskController.js";
import {loginUser, registerUser} from "./src/controllers/authController.js";
import {notAuthorized, setUser} from "./src/middleware/authMiddleware.js";
import {set} from "mongoose";

await connectToDB(process.env.DB_URI);

const server = http.createServer(async (req, res) => {
    const {url, method} = req;
    await setUser(req); // Set req.user = user || null

    if(url.match(/^\/api\/tasks\/?$/) && method === 'GET'){
        if(!req.user) return await notAuthorized(req, res);
        return await getAllTasks(req, res);

    }else if(url.match(/^\/api\/tasks\/?$/) && method === 'POST'){
        if(!req.user) return await notAuthorized(req, res);
        return await createNewTask(req, res);

    }else if(url.match(/\/api\/task\/[0-9]+\/?$/) && method === 'GET'){
        const id = url.split('/')[3];
        if(!req.user) return await notAuthorized(req, res);
        return await getTaskById(req, res, id);

    }else if(url.match(/\/api\/task\/delete\/[0-9]+\/?$/) && method === 'GET'){
        const id = url.split('/')[4];
        if(!req.user) return await notAuthorized(req, res);
        return await deleteTaskById(req, res, id);

    }else if(url.match(/\/api\/task\/[0-9]+\/?$/) && method === 'POST'){
        const id = url.split('/')[3];
        if(!req.user) return await notAuthorized(req, res);
        await updateTaskById(req, res, id);

    }else if(url.match(/^\/api\/register\/?$/) && method === 'POST'){
        await registerUser(req, res);

    }else if(url.match(/^\/api\/login\/?$/) && method === 'POST'){
        await loginUser(req, res);
    }

    else{
        return res.end(JSON.stringify({msg: 'Page not found!'}));
    }
});

server.listen(process.env.PORT || 8000);

