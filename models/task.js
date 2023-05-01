import mongoose from "mongoose";

const taksSchema = mongoose.Schema({
   task:{
    type:String,
    required:true,
   },
   date:{
    type:Date,
    default:new Date()
   },
   isCompleted:{
      type:Boolean,
      default:false
   },
   user:{
    type:mongoose.Types.ObjectId,
    required:true
   }
});


const task = mongoose.model("task", taksSchema);

export default task;