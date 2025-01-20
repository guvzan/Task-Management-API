import Task from "../models/taskModel.js";

const getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.find();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({tasks}));
    }catch (e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(JSON.stringify({message: `Cannot get all tasks: ${e}`})));
    }
}

const createNewTask = async (req, res) => {
    try{
        let body = [];
        req
            .on('data', chunk => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();
                const {title, description, status, dueDate} = JSON.parse(body);
                console.log(body);
                const task = new Task({
                    title,
                    description,
                    status,
                    dueDate
                });
                task.save();
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    message: 'success',
                    task
                }));
            });
    }catch (e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(JSON.stringify({message: `Cannot create new task: ${e}`})));
    }
}

export {
    getAllTasks,
    createNewTask
}