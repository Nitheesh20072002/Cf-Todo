import mongoose from "mongoose";

const Schema=mongoose.Schema;

const userSchema= new Schema({
    handle: String,
    following: [String],
    followers: [String],
    submissions:[
        {
            handle:String,
            problemId: String,
            problemName:String,
            problemStatus: String,
        },
    ],
    todo:[
        {
            handle:String,
            problemId: String,
            problemName:String,
            problemStatus: String,
        }
    ],
});

export default mongoose.model('User',userSchema);
