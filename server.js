import express from 'express';
import path from 'path';
import {getData} from '../new/utils/scrapping.js';
import Joi from 'joi';
// import { userSchema } from './schemas.js';
import User from './models/user.js'
import {mongoose} from 'mongoose';
import { updateNew,removefromtodo } from './utils/todohelper.js';


mongoose.connect('mongodb://localhost:27017/cf',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology: true
})
const db=mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const app=express();

let __dirname = path.resolve();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('Home');
});


app.get('/submissions/:handle', async (req,res)=>{
    const {handle}=req.params;
    const details=await User.find({handle:handle});
    const submissions=details[0].submissions;
    res.render('index',{handle,submissions});
});

app.get('/todo/:handle',async (req,res) =>{
    const {handle}=req.params;
    const details=await User.find({handle:handle});
    if(details===undefined || details[0]===undefined || details[0].todo===undefined){
        res.send('Undefined error');
    }else {
        const todos=details[0].todo;
        res.render('todolist',{handle,todos});
    }
});

app.get('/:handle', async (req,res)=>{
    const {handle}=req.params;
    const details=await User.find({handle:handle});
    if(details===undefined || details[0]===undefined || details[0].following===undefined){
        res.send('Undefined error');
    }else {
        const friends=details[0].following;
        res.render('friends',{handle,friends});
    }
    
})

app.post('/updatetodo',async (req,res)=>{
    let {inputcheck,handle}=req.body;
    handle=handle.trim();
    inputcheck=inputcheck.trim();
    await removefromtodo(handle,inputcheck);
    const url=`/todo/${handle}`;
    res.redirect(url);
});

app.get('/addnew/:handle',(req,res)=>{
    const {handle}=req.params;
    res.render('new',{handle});
});

app.post('/addnew',async (req,res)=>{
    let {userHandle,friendHandle} =req.body;
    userHandle=userHandle.trim();
    friendHandle=friendHandle.trim();
    if(userHandle && friendHandle){
        const checkin=await User.find({'handle':friendHandle});
        if(checkin.length === 0){
            // res.send('Not found in db');
            await User.updateOne({'handle':userHandle},{$push:{"following": friendHandle}});
            const newuser = new User({
                'handle': friendHandle,
                'following': [],
                'followers': [userHandle],
                'todo':[],
            });
            await getData(friendHandle,2).then(async (data) =>{
                newuser.submissions.push(data);
                await User.updateOne({'handle':userHandle},{$push:{"todo": data}});
            }).catch(err => console.log(err));
            await newuser.save();
        }else{
            const followin=(await User.find({'handle':userHandle}))['0'].following;
            let pre=true;
            followin.forEach(handler => {
                if(handler===friendHandle) pre=false;
            });
            if(pre){
                await User.updateOne({'handle':userHandle},{$push:{"following": friendHandle}});
                const submis=checkin['0'].submissions;
                // console.log(submis);
                if(submis.length !==0 )await User.updateOne({'handle':userHandle},{$push:{"todo": submis}});
            };
        }        
        res.redirect(`/${userHandle}`);
    }else res.send('Empty data found');
    // res.send('added');
});

app.post('/unfollow',async (req,res)=>{
    let {userHandle,friendHandle} =req.body;
    userHandle=userHandle.trim();
    friendHandle=friendHandle.trim();
    console.log(userHandle);
    console.log(friendHandle);
    await User.updateOne({'handle':userHandle},{$pull:{"following": friendHandle}});
    await User.updateOne({'handle':friendHandle},{$pull:{"followers": userHandle}});
    const data=(await User.find({'handle':friendHandle}))['0'].submissions;
    data.forEach(async (submis)=>{
        await removefromtodo(userHandle,submis.problemId);
    });
    res.redirect(`/${userHandle}`);
});
// app.get('/:handle',async (req,res)=>{
//     const handle=req.params.handle;
//     const friends=findByHandle(handle);
//     let data = [];
//     const len=friends.length;
//     for(let x=0;x<len;x++){
//         const friend=friends[`${x}`];  
//         await getData(friend).then(function (user){  
//             data.push(user);
//             // console.log(data);
//             if((data.length) === len){
//                 res.render('index',{data});
//             }
//         })
//         .catch(()=>{return []});
//     }
//     if(len === 0) res.send('no data found');
//     // const data=retdata(handle); 
//     // console.log(data);
// });




// function findByHandle(handle){
//     for(let i=0;i<db.length;i++){
//         if(db[i].handle === handle){
//             return db[i].friends;
//         }
//     }
//     return [];
// }

// function findind(handle){
//     for(let i=0;i<db.length;i++){
//         if(db[i].handle === handle){
//             return i;
//         }
//     }
//     return -1;
// }

app.listen('3000',()=>{
    console.log('Listening');
})
