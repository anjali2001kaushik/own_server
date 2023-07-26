const queryString=require('querystring');
module.exports= function doLogin(request,response){
    let postData='';
    request.on('data',chunk=>{
        postData=postData+chunk;
    });
    request.on('end',()=>{
        console.log('Data From Post',postData);
        const obj=queryString.parse(postData);
        console.log('Data From Post ',obj);
        if(obj.userid===obj.password){
            response.write('Welcome User '+obj.userid);
        }
        else{
            response.write('Invalid Userid or password');
        }
         // response.write('Login....');
         response.end();
    });
}