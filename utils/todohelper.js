import User from '../models/user.js'
import { getData } from '../utils/scrapping.js';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/cf',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
const db=mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const updateNew= async ()=>{
    const allusers=await User.find();
    for(let x in allusers){
        const cur=allusers[`${x}`]['_doc']; 
        await updatesingle(cur.handle);
    }
    console.log('done');
};

async function updatesingle(handle){
    console.log(handle);
    const details=await User.find({handle:handle});
    if(details[0].submissions.lenght === 0) return;
    let cur=details[0].submissions.pop();
    let curId=cur.problemId;
    var start=2;
    var ok=true;
    while(ok){
        await getData(handle,start).then((details)=>{
            if(details.problemId!=curId){
                start+=2;
            }else{
                ok=false;
            }
        }).catch((err)=>console.log(err));
    }
    // db.users.update({handle:'neal'},{$pop:{"todo":-1}})
    // db.users.update({handle:'neal'},{$push:{"todo":{object}}})

    while(start>=2){
        await getData(handle,start).then(async (details)=>{
            if(start!=2){
                await User.updateOne({'handle':handle},{$push:{"submissions": details }});
                const somearr=await User.find({'handle':handle});
                const followers=somearr['0']['followers']; 
                for(let x in followers){
                    const follower=followers[`${x}`];
                    await User.updateOne({'handle':follower},{$push:{"todo":details}});
                }
            }
        });
        start-=2;
    }
}

const removefromtodo = async (handle,probId) =>{
    // db.survey.updateMany({ }, $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } })
    await User.updateMany({'handle':handle}, {$pull:{todo:{'problemId':probId}}});
};

// removefromtodo('tourist',"/contest/1684/problem/G");
// updateNew();
export {updateNew,removefromtodo};