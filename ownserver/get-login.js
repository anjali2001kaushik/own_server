const url=require('url');
const fs=require('fs');
const path=require('path');
module.exports=function doGetLogin(request,reponse){
const getData=request.url;
const obj=url.parse(getData,true);
console.log('Get',obj);
if(obj.query.userid==='admin' && obj.query.password==='111'){
    const fullPath=path.join(__dirname,'public','dashboard.html');
    const stream=fs.createReadStream(fullPath);
}
}