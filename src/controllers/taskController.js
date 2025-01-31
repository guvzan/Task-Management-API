import Task from "../models/taskModel.js";
import {URL, URLSearchParams} from "node:url";
import {canViewTasks} from "../middleware/authMiddleware.js";

const getAllTasks = async (req, res) => {
    const fullURL = new URL(req.url, `http://${req.headers.host}`);
    const status = fullURL.searchParams.get('status');
    const date = fullURL.searchParams.get('date');
    const sort = fullURL.searchParams.get('sort') || 'dueDate';
    const order = Number(fullURL.searchParams.get('order')) || -1;
    const dbQuery = {};
    if(status) dbQuery.status = status;
    if(date) dbQuery.dueDate = date;

    let limit = Number(fullURL.searchParams.get('limit')) || 5;
    let page = Number(fullURL.searchParams.get('page')) || 0;
    if(limit<1) limit = 1;
    if(page<0) page = 0;

    try{
        const tasks = await Task
            .find(dbQuery)
            .sort([[sort, order]])
            .skip(page*limit)
            .limit(limit);
        if(!tasks?.length){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'No tasks found!'}));
        }
        const allowedTasks = canViewTasks(req.user, tasks)
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({tasks: allowedTasks}));
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
            .on('end', async () => {
                body = JSON.parse(Buffer.concat(body).toString());
                const {title, description, status, dueDate} = body;
                const task = new Task({
                    title,
                    description,
                    status,
                    dueDate,
                    createdBy: req.user
                });
                await task.save();
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

const updateTaskById = async (req, res, id) => {
    try{
        let body = [];
        req
            .on('data', chunk => {
                body.push(chunk);
            })
            .on('end', async () => {
                body = JSON.parse(Buffer.concat(body).toString());
                const {title, description, status, dueDate} = body;
                const task = await Task.findById(id);
                if(!task){
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({message: `Task with id ${id} not found`}));
                }
                const taskData = {
                    title: title || task.title,
                    description: description || task.description,
                    status: status || task.status,
                    dueDate: dueDate || task.dueDate
                }
                const updTask = await Task.updateOne({_id: id}, taskData);
                res.writeHead(200, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: 'success', task: updTask}));
            });
    }catch(e){
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: `Cannot find task with id: ${id} not found! Error: ${e}`}));
    }
}

export {
    getAllTasks,
    createNewTask,
    getTaskById,
    deleteTaskById,
    updateTaskById
}