import mongoose  from 'mongoose';
import User from '../models/user.js';
import {getData} from '../utils/scrapping.js';

mongoose.connect('mongodb://localhost:27017/cf', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const sample = ['neal','tourist','Errichto','Priyansh31dec','NitheeshKumar4','NitheeshKumarChapala'];


const seedDB = async () => {
    await User.deleteMany({});
    for (let i = 0; i < 6; i++) {
        let arr=[];
        for(let j=0;j<6;j++){
            if(i!=j) arr.push(sample[j]);
        }
        const newuser = new User({
            handle: sample[i],
            following: arr,
            followers: arr,
        });
        await getData(sample[i],4).then((data) =>{
            const submis={
                problemId: data.problemId,
                problemName: data.problemName,
                problemStatus: data.problemStatus,
            }
            newuser.submissions.push(submis);
        });
        await newuser.save();
    }    
    
}

seedDB().then(() => {
    mongoose.connection.close();
})