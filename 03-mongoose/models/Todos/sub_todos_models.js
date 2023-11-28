import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
    },
    compelete : {
        type:Boolean,
        default : false,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"ser"
    }


},{timestamps:true});



export const SubTodo = mongoose.model("SubTodo",subTodoSchema);