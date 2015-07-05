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
var myjson = { "value1" : "ABCDEF", "value2" : "QWERTY" };
console.log("myjson: "+myjson);
myfs.writeFile(__dirname+"samplejson.json", JSON.stringify( myjson ), "utf8", function (err) {
	console.log("Callback");
	if (err) throw err;
	console.log("File Saved");
});

myJSON = myfs.readFile(__dirname+"samplejson.json", flag="utf8", function(err, data){
	//console.log(err);
	if (err) throw err;
	console.log(data);
	data = JSON.parse(data);
	console.log(data["value1"]);
	console.log(data["value2"]);
});

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
	 console.log(arg);  // prints URL
	 console.log('----> file://' + __dirname + arg);
	 //event.sender.send('asynchronous-reply', 'pong');
	 mainWindow.loadUrl('file://' + __dirname + arg);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});