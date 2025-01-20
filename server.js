import http from 'http';
import 'dotenv/config.js'
import {connectToDB} from "./src/utils/dbUtils.js";
import {createNewTask, getAllTasks} from "./src/controllers/taskController.js";

await connectToDB(process.env.DB_URI);

const server = http.createServer(async (req, res) => {
    const {url, method} = req;
    if(url === '/api/tasks' && method === 'GET'){
        await getAllTasks(req, res);
    }else if(url === '/api/tasks' && method === 'POST'){
        await createNewTask(req, res);
    }
    else{
        res.end(JSON.stringify({msg: 'Not found!'}));
    }
});

server.listen(process.env.PORT || 8000);

