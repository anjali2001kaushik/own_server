const chalk=require('chalk');
const http=require('http');
const figlet=require('figlet');
const fs=require('fs');
const path=require('path');
function servepage(response,fileName='index.html'){
    const fullPath=path.join(__dirname,'public',fileName);
    const extension=path.extname(fullPath);
    console.log('Extension is ',extension)
    if(extension==='.css'){
        response.setHeader('content-type','text/css');
    }
    else if(extension==='.mp4'){
        response.setHeader('content-type','video/mp4');
    }
    else {
        response.setHeader('content-type','text/html');
    }
    const readStream=fs.createReadStream(fullPath);
    readStream.pipe(response);
}
function isStaticContent(fileName){
    if(fileName==='/'){
        fileName='index.html'
    }
    const staticExt= [".html", ".css", ".js", ".png", ".jpeg", ".mp4"];
    const fullPath= path.join(__dirname,'public',fileName);
    const extension= path.extname(fullPath);
    return staticExt.indexOf(extension)>=0;
}
function handleRequestAndResponse(request,response){
    console.log("Here request comes...",request.url);
    const urlString=request.url;
    const method=request.method;
    if(isStaticContent(urlString)){
        if(urlString==='/'){
            servepage(response);
        }
        else {
            servepage(response,urlString)
        }
    }
    else if(urlString ==='/login' && method==='POST'){
        login(request,response);
     // response.write('Login Request ');
        // response.end();
    }
    else if (urlString.startsWith('/login') && method ==='GET'){
        getLogin(request, response);
        // response.write('Login Request ');
        // response.end();
    }
    else if(urlString == '/big-task'){
        bigTask();
        response.write('Big Task Done....');
        response.end();
    }
    else{
        response.write('OOPS U Type Something Else...');
        response.end();
    }
   
    // Serve Static Pages


    // Serve Dynamic Content

    //servePage(response);
    //console.log('Request Rec ');
    // response.setHeader('Content-Type', 'text/html');
    // response.setHeader('refresh', "3");
    //<meta http-equiv="refresh" content="10">
    // response.write('<h1>Hello Client......</h1>');
    //response.end();
}
    const cluster=require('cluster');
    const os=require('os');
    if(cluster.isPrimary){//isMaster depricated, Master process triggers child processes...
        console.log('Master Happens');
        const cores=os.cpus.length;
        for(let i=1;i<=cores;i++){
            cluster.fork();//Node instances (Child Process)
        }
        cluster.on('online',(worker)=>{
            console.log('worker online',worker.process.pid)
        })
        cluster.on('exit',(worker)=>{

        })

    }
    else{
        console.log('Fork Happens......')
        //pizza
        const server=http.createServer(handleRequestAndResponse);
        server.listen(process.env.port|| 9755 ,err=>{
            if(err){
                console.log(chalk.red.bold('Error during Server up'),err);
            }
            else {
                figlet('Server Up..',(err,data)=>{
                    if(err){
                        console.log("Error in figlet");
                    }
                    else {
                        console.log(chalk.green.bold(data));
                        console.log(chalk.yellow.bold('@'+server.address().port));
                    }
                })
                //console.log(chalk.green.bold('Server Up and Running '), server.address().port);
            }
        })
    }
    
    
