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

await connectToDB(process.env.DB_URI);

const server = http.createServer(async (req, res) => {
    const {url, method} = req;
    if(url === '/api/tasks' && method === 'GET'){
        return await getAllTasks(req, res);
    }else if(url === '/api/tasks' && method === 'POST'){
        return await createNewTask(req, res);
    }else if(url.match(/\/api\/task\/[0-9]+/) && method === 'GET'){
        const id = url.split('/')[3];
        return await getTaskById(req, res, id);
    }else if(url.match(/\/api\/task\/delete\/[0-9]+/) && method === 'GET'){
        const id = url.split('/')[4];
        return await deleteTaskById(req, res, id);
    }else if(url.match(/\/api\/task\/[0-9]+/) && method === 'POST'){
        const id = url.split('/')[3];
        await updateTaskById(req, res, id);
    }
    else{
        return res.end(JSON.stringify({msg: 'Not found!'}));
    }
});

server.listen(process.env.PORT || 8000);

