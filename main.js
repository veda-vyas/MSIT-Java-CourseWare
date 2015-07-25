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



var userid="narsimha.msit@gmail.com";
//Write to a file in local system
var myfs = require('fs');
myfs.exists(__dirname+"/userdatajson.json",function(exists){
	if(!exists){
		myfs.writeFile(__dirname+"/userdatajson.json",JSON.stringify({"userdata":[],"lastsync":0,"userid":userid}),"utf8",function(err){});
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
		console.log("module no: "+modjson["modules"][""+i]["title"]);
		for(var j=0;j<modjson["modules"][""+i]["lessons"].length;j++){
			modjson["modules"][""+i]["lessons"][j]["qid"]=i+"."+(j+1);
			
		}	
	}
	myfs.writeFile(__dirname+"/moduledata.json",JSON.stringify(modjson),"utf8",function(err){});
});*/

//Check if internet connection is present through dns lookup


//encrypt & decrypt functions
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
 
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

//end of encrypt & decrypt
// encrypt & decrypt example
/*myJSON = myfs.readFile(__dirname+"/moduledata.json", flag="utf8", function(err, data){
	data = JSON.parse(data);
	var modjson=data;
	for(i=1; i<=Object.keys(modjson["modules"]).length; i++){
		//console.log("module no: "+modjson["modules"][""+i]["title"]);
		for(var j=0;j<modjson["modules"][""+i]["lessons"].length;j++){
			var type=modjson["modules"][""+i]["lessons"][j]["type"];
			if(type=="quiz"){
				var mdata=modjson["modules"][""+i]["lessons"][j]["answer"];
				for (var k=0;k<mdata.length;k++){
					if(mdata[k]!=""){
						console.log("answer data: "+mdata[k]+" qid: "+modjson["modules"][""+i]["lessons"][j]["qid"]);
    					mdata[k]=encrypt(mdata[k]);
    				}
    			}
    			modjson["modules"][""+i]["lessons"][j]["answer"]=mdata;
			}
			
		}	
	}
	myfs.writeFile(__dirname+"/moduledata_decrypt.json",JSON.stringify(modjson),"utf8",function(err){});
});*/

/*myJSON = myfs.readFile(__dirname+"/sample_ency.json", flag="utf8", function(err, data){
	data=JSON.parse(data);
	var myjson=data;
	for (var k=0;k<data["modules"].length;k++){
		myjson["modules"][k]["ans"]=decrypt(data["modules"][k]["ans"]);
	}
	myfs.writeFile(__dirname+"/sample_decy.json",JSON.stringify(myjson),"utf8",function(err){});
});
*/
//end of the encrypt & decrypt example

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
	 mainWindow.loadUrl('file://' + __dirname + arg);
	  checkOnlineAndUpdate();
  });
  checkOnlineAndUpdate();
  //IPC to store userdata
  ipc.on('process-data', function(event, arg) {
	myJSON = myfs.readFile(__dirname+"/userdatajson.json", flag="utf8", function(err, data){
		//console.log(err);
		if (err) throw err;
		data = JSON.parse(data);
		var modjson = data;
		var i=data["userdata"].length;
		arg["sno"]=""+(i+1);
		modjson["userdata"][i]=arg;//{"qid":""+strarr[0],"startTime":strarr[0],"submittedTime":strarr[1],"score":strarr[2]};
		myfs.writeFile(__dirname+"/userdatajson.json",JSON.stringify(modjson),"utf8",function(err){});
	});
  });
 function appendProgram(mod,less,program,output){
	myJSON = myfs.readFile(__dirname+"/moduledata.json", flag="utf8", function(err, data){
	data = JSON.parse(data);
	var myjson=data;
	var outputwithbr="";
	for(var i=0;i<output.length;i++){
		if(output.charAt(i)=='\n'){
			outputwithbr +="<br>";
		}else{
			outputwithbr +=output.charAt(i);
		}
	}
	myjson["modules"][mod]["lessons"][parseInt(less)-1]["question"]=program;
	myjson["modules"][mod]["lessons"][parseInt(less)-1]['output']=outputwithbr;
	//console.log("qn: "+myjson["modules"][mod]["lessons"][parseInt(less)-1]["output"]);
	myfs.writeFile(__dirname+"/moduledata.json",JSON.stringify(myjson),"utf8",function(err){});
});
console.log("output:"+output);
//console.log(mod+" "+less+" "+program+" "+output);
//mainWindow.loadUrl('file://' + __dirname + "module.html?mod="+mod+"&les="+(parseInt(less)));
}
ipc.on('execute-program',function(event,arg,modles){
  	console.log("retrieved data:"+arg);
  	var moduleandlesson=modles.split("|");
  	var mod=moduleandlesson[0];
  	var lesson=moduleandlesson[1];
  	console.log("mod:"+mod+" lesson:"+lesson);
  	var writeStream = myfs.createWriteStream(__dirname+"/programs/Solution.java");
	writeStream.write(arg);
	//writeStream.write("Thank You.");
	writeStream.end();
	var output="";
	var nodeexec = require('child_process').exec;
	nodeexec('javac '+__dirname+'\\programs\\Solution.java', function callback(error, stdout, stderr){
		if(error == null){
			nodeexec('java -cp '+__dirname+'\\programs Solution', function callback(error, stdout, stderr){
				if(error == null){
					output=stdout;
					console.log("NODE EXEC OUTPUT: "+stdout+" output: "+output);
					appendProgram(mod,lesson,arg,output);
				} else {
					output=stderr;
					console.log("NODE EXEC4: "+stderr);
					appendProgram(mod,lesson,arg,output);
					
					//console.log("NODE EXEC4: "+stdout);
					//console.log("NODE EXEC4: "+stderr);
				}
			});
		} else {
			output=stderr;
			console.log("NODE EXEC: "+stderr);
			appendProgram(mod,lesson,arg,output);
			
			//console.log("NODE EXEC: "+stdout);
			//console.log("NODE EXEC: "+stderr);
		}
	});
});
ipc.on('execute-Apiprogram',function(event,classname,testcases,userprogram,modles){
  	console.log("retrieved data:"+userprogram+"\n"+testcases);
  	var moduleandlesson=modles.split("|");
  	var mod=moduleandlesson[0];
  	var lesson=moduleandlesson[1];
  	console.log("mod:"+mod+" lesson:"+lesson);
  	var writeStream = myfs.createWriteStream(__dirname+"/programs/"+classname+".java");
	writeStream.write(userprogram+"\n");
	writeStream.write(testcases);
	writeStream.end();

	var output="";
	var userprogram_error_status=false;
	var nodeexec = require('child_process').exec;
	nodeexec('javac '+__dirname+'\\programs\\'+classname+'.java', function callback(error, stdout, stderr){
		if(error == null){
			nodeexec('java -cp '+__dirname+'\\programs '+classname, function callback(error, stdout, stderr){
				if(error == null){
					output=stdout;
					console.log("NODE EXEC OUTPUT TestPrgm: "+stdout+" output: "+output);
					appendProgram(mod,lesson,userprogram,output);
				} else {
					output=stderr;
					console.log("NODE EXEC4: "+stderr);
					appendProgram(mod,lesson,userprogram,output);
					
					//console.log("NODE EXEC4: "+stdout);
					//console.log("NODE EXEC4: "+stderr);
				}
			});
		} else {
			output=stderr;
			console.log("NODE EXEC: "+stderr);
			appendProgram(mod,lesson,userprogram,output);
		}
	});
	
});


function loadUserdata(){
	var userdata="";
	myJSON = myfs.readFile(__dirname+"/userdatajson.json", flag="utf8", function(err, data){
		
		var syncdata=JSON.parse('{"userdata":[]}');
		data = JSON.parse(data);
		var length=data["userdata"].length;
		if(length==0){
			data["lastsync"]=0;
		}
		else if(data["lastsync"]!=length){
			var sno=data["lastsync"];
			console.log("lastsync before update:"+sno);
			var i=0;
			for (var j=sno;j<length;j++){
				syncdata["userdata"][i]=data["userdata"][j];
				i++;		
			}
			data["lastsync"]=j;
			console.log("last sync is: "+j);
			
			myfs.writeFile(__dirname+"/userdatajson.json",JSON.stringify(data),"utf8",function(err){
			});
			userdata=JSON.stringify(syncdata);
			console.log("records: "+userdata);
			var httpify = require('httpify');

			var req = httpify({
			//url: 'https://activity-log-tmt.appspot.com/getdigistate',
			url: 'https://msit-prep.appspot.com/setcourse',
			method: 'POST',
			type: 'text',
			
			form: {userid: userid, userdata: userdata, course : "java"}
			}, function (err, response, body) {
				console.log("sync error in form: "+err);
			});

			req.then(function (response) {
			// Do stuff 
			console.log(response.body);
			}, function (errResponse) {
			// status: 400 - 599 
				console.log("sync err: "+errResponse);
			});
		}
	});
	
}
function checkOnlineAndUpdate(){
	var isOnline = require('is-online');
	isOnline(function(err, online) {
	console.log("Online Status: "+online);
		if(online){
			loadUserdata();
		}
	});
}
/*var nodeexec = require('child_process').exec;
nodeexec('hostname', function callback(error, stdout, stderr){
	userid=stdout.trim();
	console.log("hostname: "+stdout);
	//syncdata();
});*/

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});