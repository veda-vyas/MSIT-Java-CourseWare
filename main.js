var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc'); // Inter Process Communication

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

/*
var mico = require('microphone');

mico.startCapture();

mico.audioStream.on('data', function(data) {
	process.stdout.write(data);
});*/


// Node.js Snippet to create a process and execute a command to COMPILE and RUN java program
var nodeexec = require('child_process').exec;
nodeexec('javac E:\\Electron\\MyApp.java', function callback(error, stdout, stderr){
	if(error == null){
		nodeexec('java -cp E:\\Electron MyApp', function callback(error, stdout, stderr){
			if(error == null){
				console.log("NODE EXEC OUTPUT: "+stdout);
			} else {
				console.log("NODE EXEC4: "+error);
				console.log("NODE EXEC4: "+stdout);
				console.log("NODE EXEC4: "+stderr);
			}
		});
	} else {
		console.log("NODE EXEC: "+error);
		console.log("NODE EXEC: "+stdout);
		console.log("NODE EXEC: "+stderr);
	}
});

//Write to a file in local system
var myfs = require('fs');
myfs.exists(__dirname+"/userdatajson.json",function(exists){
	if(!exists){
		myfs.writeFile(__dirname+"/userdatajson.json",JSON.stringify({"userdata":[]}),"utf8",function(err){});
		console.log("File Created.");
	}
	else{
		console.log("File exists.");
	}
});
/*var myjson = { "userdata":[]};
console.log("myjson: "+myjson);
myfs.writeFile(__dirname+"/userdatajson.json", JSON.stringify( myjson ), "utf8", function (err) {
	console.log("Callback");
	if (err) throw err;
	console.log("File Saved");
});
*/
/*myJSON = myfs.readFile(__dirname+"/moduledata.json", flag="utf8", function(err, data){
	
	data = JSON.parse(data);
	var modjson=data;
	for(i=1; i<=Object.keys(modjson["modules"]).length; i++){
		//console.log("module no: "+modjson["modules"][""+i]["title"]);
		for(var j=0;j<modjson["modules"][""+i]["lessons"].length;j++){
			modjson["modules"][""+i]["lessons"][j]["qid"]=i+"."+(j+1);
			
		}	
	}
	myfs.writeFile(__dirname+"/moduledata1.json",JSON.stringify(modjson),"utf8",function(err){});
});*/

//Check if internet connection is present through dns lookup
require('dns').lookup('www.google.com', function(err) {
	if (err && err.code == "ENOTFOUND"){
		console.log("Internet Connection Present");
	} else {
		console.log("No Internet !");
	}
});

//Check if internet connection is present through process
var exec = require('child_process').exec, child;
child = exec('ping -c 1 192.168.1.100', function(error, stdout, stderr){
     if(error != null)
          console.log("Not available [INTERNET]");
      else
          console.log("Available [INTERNET]");
});



// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 700, frame: true});
  //console.log("DIR NAME: "+__dirname);
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/course.html');
  //mainWindow.loadUrl('file://' + __dirname + '/module.html?mod=1&les=4');
  //mainWindow.loadUrl('https://github.com');
  //mainWindow.loadUrl('https://google.com');
  //mainWindow.loadUrl('file://'+__dirname+'/keystest.html');
  
  // IPC to navigate to another URL
  ipc.on('asynchronous-message', function(event, arg) {
	 //console.log(arg);  // prints URL
	 //console.log('----> file://' + __dirname + arg);
	 //event.sender.send('asynchronous-reply', 'pong');
	 mainWindow.loadUrl('file://' + __dirname + arg);
  });
  ipc.on('process-data', function(event, arg) {
	myJSON = myfs.readFile(__dirname+"/userdatajson.json", flag="utf8", function(err, data){
		//console.log(err);
		if (err) throw err;
		//console.log(data);

		data = JSON.parse(data);
		var modjson=data;
		var i=data["userdata"].length;
		
		arg["sno"]=""+(i+1);
		modjson["userdata"][i]=arg;//{"qid":""+strarr[0],"startTime":strarr[0],"submittedTime":strarr[1],"score":strarr[2]};
		myfs.writeFile(__dirname+"/userdatajson.json",JSON.stringify(modjson),"utf8",function(err){});
	});
	 
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});