import {Schema, model} from "mongoose";

const taskSchema = new Schema({
    title: String,
    description: String,
    status: {type: String, enum: ['Pending', 'Completed']},
    dueDate: Date,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Task = model('Task', taskSchema);

export default Task;

