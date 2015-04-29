let fs=require('fs');
let path= require('path');
let express = require('express');
let morgan = require('morgan');
let nodeify = require('bluebird-nodeify');

require('songbird');

const NODE_ENV = process.env.NODE_ENV;
const PORT= process.env.PORT || 8000;
const ROOT_DIR = path.resolve(process.cwd());

let app=express();

if(NODE_ENV === 'development'){
	app.use(morgan('dev'));
}

app.listen(PORT,() => console.log('Listening @ http://127.0.0.1:${PORT}'));

app.get('*',(req, res, next) => { 
  
  async() =>{
  	let filePath = path.resolve(path.join(ROOT_DIR,req.url));
  if(filePath.indexOf(ROOT_DIR) !==0){
  	res.send(400,'invalid path');
  	console.log(' empty return');
  	return;
  }
  //returns a directory 
  // promise version of the callback to read file
  let stat = await fs.promise.stat(filePath);

  if(stat.isDirectory()){
   let files= await	fs.promise.readdir(filePath);
   res.json(files);
   console.log(' empty return2',files);
   return;
  }

  fs.createReadStream(filePath).pipe(res);
}().catch(next)

  


});