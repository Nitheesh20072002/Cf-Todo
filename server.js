import express from 'express';
import path from 'path';
import {getData} from '../new/utils/scrapping.js';
import Joi from 'joi';
import { userSchema } from './schemas.js';
import User from './models/user.js'
import {mongoose} from 'mongoose';
import { updateNew,removefromtodo } from './utils/todohelper.js';
// import { updateNew } from './utils/todohelper.js';

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

// var db=[
//     {   'handle':'NitheeshKumarChapala',
//         'friends':['neal','tourist','Errichto','Priyansh31dec','NitheeshKumar4'],
//     },
//     {
//         'handle': 'neal',
//         'friends':['NitheeshKumarChapala','tourist','Errichto','Priyansh31dec','NitheeshKumar4'],
//     },
//     {   
//         'handle': 'tourist',
//         'friends':['neal','maroonrk','Errichto','Priyansh31dec','NitheeshKumar4'],
//     },
//     {   
//         'handle': 'Priyansh31dec',
//         'friends':['neal','tourist','Errichto','Benq','NitheeshKumar4'],
//     },
// ];

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
    console.log(handle);
    if(details===undefined || details[0]===undefined || details[0].todo===undefined){
        res.send('Undefined error');
    }else {
        const todos=details[0].todo;
        res.render('todolist',{handle,todos});
    }
});
// updateNew();
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
// app.get('/addnew',(req,res)=>{
//     res.render('new');
// });
// app.post('/addnew',(req,res)=>{
//     const {userHandle,friendHandle} =req.body;
//     console.log(userHandle);
//     console.log(friendHandle);
//     if(userHandle && friendHandle){
//         let ind=findind(userHandle);
//         if(ind=== (-1)){
//             db.push({'handle':userHandle,'friends':[friendHandle]});
//         }else{
//             let check=true;
//             // for(let i=0;i<db[ind].friends.length;i++){
//             //     if(db[ind].friends[i] === friendHandle){
//             //         check=false;break;
//             //     }
//             // }
//             // if(check){
//             //     db.friends[ind].push(friendHandle);
//             // }
//         }
//     }else res.send('Empty data found');
// });

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
