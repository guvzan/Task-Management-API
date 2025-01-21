import http from 'http';
import 'dotenv/config.js'
import {connectToDB} from "./src/utils/dbUtils.js";
import {createNewTask, getAllTasks, getTaskById} from "./src/controllers/taskController.js";

await connectToDB(process.env.DB_URI);

const server = http.createServer(async (req, res) => {
    const {url, method} = req;
    if(url === '/api/tasks' && method === 'GET'){
        await getAllTasks(req, res);
    }else if(url === '/api/tasks' && method === 'POST'){
        await createNewTask(req, res);
    }else if(url.match(/\/api\/task\/[0-9]+/) && method === 'GET'){
        const id = url.split('/')[3];
        await getTaskById(req, res, id);
    }
    else{
        res.end(JSON.stringify({msg: 'Not found!'}));
    }
});

server.listen(process.env.PORT || 8000);

