import Task from "../models/taskModel.js";

const getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.find();
        if(!tasks?.length){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'No tasks found!'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({tasks}));
    }catch (e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(JSON.stringify({message: `Cannot get all tasks: ${e}`})));
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
                const task = new Task({
                    title,
                    description,
                    status,
                    dueDate
                });
                task.save();
                res.writeHead(201, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({
                    message: 'success',
                    task
                }));
            });
    }catch (e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(JSON.stringify({message: `Cannot create new task: ${e}`})));
    }
}

const getTaskById = async (req, res, id) => {
    try{
        const task = await Task.findById(id);
        if(!task){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: `Task with id ${id} not found`}))
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'success', task}))
    }catch (e){
        res.writeHead(404, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: `Cannot get task with id: ${id} not found! Error: ${e}`}))
    }
}

const deleteTaskById = async (req, res, id) => {
    try{
        const task = await Task.findByIdAndDelete(id);
        if(!task){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: `Task with id: ${id} does not exist!`}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'success', task}));
    }catch(e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: `Cannot find task with id: ${id} not found! Error: ${e}`}));
    }
}

export {
    getAllTasks,
    createNewTask,
    getTaskById,
    deleteTaskById
}