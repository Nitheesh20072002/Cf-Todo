// // const Joi=require('joi');
// import Joi from 'joi';

// let userSchema= Joi.object({
//     user:Joi.object({
//         handle: Joi.string().required(),
//         friends: Joi.object({
//             handle: Joi.string().required(),
//         }).required(),
//         data: Joi.object({
//             handle: Joi.string().required(),
//             problemId:Joi.string().required(),
//             problemName:Joi.string().required(),
//             problemStatus:Joi.string().required(),
//         }).required(),
//     }).required()
// });
// export {userSchema};