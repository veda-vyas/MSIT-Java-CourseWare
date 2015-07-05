$(function(){
	//alert("Inside Course.js File");	
	var octupus = {
		init: function(){
			/*$.post("/getcourseinfo")
				.done(function(data){
					//alert("Retrieved Course Info...");
					jdata = JSON.parse(data);
					//alert(data["title2"]);
					octupus.render(jdata);
				})
				.fail(function(data){
					alert("Failed Request, ");
				});*/
			//console.log("trying to fetch json");
			if(navigator.onLine == true) 
			{
				//alert("online");
				console.log("I'm ONLINE - course js");
				//document.write("U R ONLINE");
			}
			else
			{
				//alert("offline");
				//document.write("U R OFFLINE"+navigator.onLine);
				console.log("I'm OFFLINE - course js");
			}
			$.getJSON("coursedata.json", function(data){
				console.log("Got JSON");
				//console.log(data["title"]);
				//jdata = JSON.parse(data);
				octupus.render(data);
			}).error(function(jqXhr, textstatus, error) {
				console.log("Error: "+textstatus+", "+error);
			});
			console.log("Bonkers");
			$('#courseStrtBtn').click(function(){
				console.log('in COURSEstartBtn CLICKED !!!');
				//console.log(__dirname);
				//location.href="file://"+__dirname+"/module?mod=1&les=1";
				var ipc = require('ipc');
				ipc.send('asynchronous-message', "\\module.html?mod=1&les=1");
				//console.log('done');
			});
		},
		render: function(data){
			$('#cheading').html('<h1><b>'+data["title"]+'</b></h1>');
			$('#ctrailer').html('<iframe class="embed-responsive-item" src="'+data["trailer"]+'" allowfullscreen></iframe>');
			$('#csummary').html(data["summary"]);
			$('#cwhycourse').html(data["whycourse"]);
			$('#crequirements').html(data["prerequisites"]);
			var javasyllabus = data["javasyllabus"];
			//alert(Object.keys(javasyllabus).length);
			for(var i=1; i <= Object.keys(javasyllabus).length; i++){
				$('#weeklyschedule').append('<h5><b>Week '+i+'</b></h5><ol>');
				var syllabus = javasyllabus[''+i];
				$('#weeklyschedule').append('<ol id="week'+i+'"></ol>');
				for(var j=1; j <= syllabus.length; j++){
					$('#week'+i).append('<li><a href="module.html?mod='+i+'&les='+j+'">'+syllabus[j-1]+'</a></li>');
				}
			}
			/*var syllabus = data["syllabus"];
			for(var i=1; i <= syllabus.length; i++){
				$('#syllabus_list').append('<li><a href="/module?mod='+i+'&les=1">'+syllabus[i-1]+'</a></li>');
			}*/
			
		}
	};
	
	octupus.init();
});