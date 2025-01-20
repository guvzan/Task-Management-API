import {Schema, model} from "mongoose";

const taskSchema = new Schema({
    title: String,
    description: String,
    status: {type: String, enum: ['Pending', 'Completed']},
    dueDate: Date
});

const Task = model('Task', taskSchema);

export default Task;

