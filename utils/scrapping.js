import {load} from "cheerio";
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getRawData(URL){
   return fetch(URL)
      .then((response) => response.text())
      .then((data) => {
         return data;
      });
};    

const getData=async function func(handle,rownumber=2){
   const url=`https://codeforces.com/submissions/${handle}`;
   const rawData=await getRawData(url);
   // console.log(rawData);
   const parsedData =load(rawData);
   // console.log(parsedData);
   const tableData=parsedData("table.status-frame-datatable")[0].children['1'].children;
//    console.log(tableData);
   let userData={
      'handle':'empty',
      'problemId': 'empty',
      'problemName':'empty',
      'problemStatus': 'empty',
   };
   let row=tableData[`${rownumber}`];
   if (row.name === "tr") {
      // console.log("************************");
      // console.log(Object.keys(row.children));
      let cur=row.children[`${7}`];
      // "/n"column""/n"column"\n"column......."\n"column format
      if(cur.name === "td"){
         // console.log('#################################################');
         // console.log(row.children['5'].children['0'].next.children['0'].parent.attribs.href.substring(9));
         userData.handle = row.children['5'].children['0'].next.children['0'].parent.attribs.href.substring(9);
         // console.log(cur.children['1'].attribs['href']);
         userData.problemId= cur.children['1'].attribs['href'];
         // console.log(cur.children['1'].children['0'].data.trim());
         userData.problemName = cur.children['1'].children['0'].data.trim()
         // console.log(row.children['11'].children['0'].next.attribs.submissionverdict);
         userData.problemStatus = row.children['11'].children['0'].next.attribs.submissionverdict;
         // console.log('#################################################');
      }
   }      
//    console.log(userData);
   return userData;
}

// console.log('for codeforces*****************');
// const userData=await getData('tourist',4).then(function (user){ 
//    const obj={
//       'handle':user.handle,
//       'problemId': user.problemId,
//       'problemName': user.problemName,
//       'problemStatus': user.problemStatus,
//    }
//    return obj;
// })
// console.log(userData);
// console.log(await getData('neal'));
// console.log('***********************');
// console.log(await getData('NitheeshKumarChapala'));
// console.log('for cricket');
// await getData(URL);

export{getData};

