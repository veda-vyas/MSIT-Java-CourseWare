$(function(){
	//alert("Inside Module.js File");	
	var octopus = {    
		init: function(){
			mod1=1;
			les1=1;
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) 
			{
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == "mod") 
				{
					mod1=sParameterName[1];
				} else {
					les1=sParameterName[1];
				}
			}

			var lessonSize = 1;
			/*$.post("/getmoduleinfo", {mod:mod1, les:les1})
				.done(function(data){
					//alert("Retrieved Module Info...");
					jdata = JSON.parse(data);
					//alert(jdata["lessonsize"]);
					lessonSize = jdata["lessons"].length;
					octopus.render(jdata, mod1, les1, lessonSize);
				})
				.fail(function(data){
					alert("Failed Request, ");
				});*/
			//console.log("trying to fetch Module json");
			$.getJSON("moduledata.json", function(data){
				//console.log("Got JSON");
				//console.log(data["title"]);
				//jdata = JSON.parse(data);
				modulejson = {};
				temp_modules = data["modules"];
				temp_module = temp_modules[''+mod1];
				modulejson['coursetitle'] = data['coursetitle'];
				modulejson['moduletitle'] = temp_module['title'];
				temp_lessons = temp_module['lessons'];
				arr_lessons = [];
				//modified i value to 0
				for(i=0; i<Object.keys(temp_lessons).length; i++){
					arr_lessons.push(temp_lessons[i]);//remove the title argument
				}
				modulejson['lessons'] = arr_lessons;
				//console.log(modulejson['lessons']);
				temp_lesson = temp_lessons[''+les1-1];
				//modulejson.push(temp_lesson);
				modulejson = $.extend(modulejson, temp_lesson);
				$.getJSON("coursedata.json", function(datas){
					modulejson['syllabus'] = datas['syllabus'];
					lessonSize = modulejson["lessons"].length;
					octopus.render(modulejson, mod1, les1, lessonSize);
					octopus.qid=octopus.getQuestionId(modulejson, mod1, les1, lessonSize);
					console.log("qid: "+octopus.qid);
				}).error(function(errA, txtst, error){
					console.log("Error2: "+txtst+", "+error);
				});			
			}).error(function(jqXhr, textstatus, error) {
				console.log("Error1: "+textstatus+", "+error);
			});
			console.log("Bonkers");
			$('#btnNext').click(function(){
				//alert("Clicked Next");
				var date=new Date();
				var strd=date.toString();
				octopus.submittedTime=strd.substring(0,strd.indexOf("GMT"));
				var ipc = require('ipc');
				octopus.stroreData();
				if(parseInt(les1)+1 <= lessonSize){
					//location.href="module?mod="+mod1+'&les='+(parseInt(les1)+1);
					
					
					//var record="2"+"12:00"+"|"+"5:00"+"|"+"0";
					ipc.send('asynchronous-message', "\\module.html?mod="+mod1+"&les="+(parseInt(les1)+1));
					
					console.log('done to NEXT');
				} else {
					//location.href="course";
					ipc.send('asynchronous-message', "\\course.html");
					console.log('done to COURSE');
				}
			});
			$('#btnPrev').click(function(){
				//alert("Clicked Previous");
				var ipc = require('ipc');
				if(parseInt(les1)-1 >= 1){
					//location.href="module?mod="+mod1+'&les='+(parseInt(les1)-1);
					ipc.send('asynchronous-message', "\\module.html?mod="+mod1+"&les="+(parseInt(les1)-1));
					console.log('done to PREV');
				} else {
					//location.href="course";
					ipc.send('asynchronous-message', "\\course.html");
					console.log('done to COURSE(PREV)');
				}
			});
		},
		render: function(data, mod1, les1, lessonSize){
			this.startTime=octopus.getStartTime();
			octopus.score=0;
			$('#courseheading').html('<h1>'+data["coursetitle"]+'</h1>');
			$('#moduleheading').html('<h4>'+data['moduletitle']+'</h4>');
			//console.log(data["lessons"]);
			for(var i=1; i <= data["lessons"].length; i++){
				if(les1 == i){
					$('#paginatedrow').append('<li id="'+i+'" data-toggle="tooltip" data-placement="bottom" title="'+data["lessons"][i-1]["title"]+'" class="active"><a href="module.html?mod='+mod1+'&les='+i+'">'+'</a></li>');
				}else{
					$('#paginatedrow').append('<li id="'+i+'" data-toggle="tooltip" data-placement="bottom" title="'+data["lessons"][i-1]["title"]+'"><a href="module.html?mod='+mod1+'&les='+i+'">'+'</a></li>');
				}
			}
			if(data['type']=='lesson'){
				this.score=0;
				$('#videodiv').html('<iframe class="embed-responsive-item" src="'+data['video']+'" allowfullscreen></iframe>');
				$('#quizbox').hide();
			} else if(data['type']=='quiz'){
				$('#quizdiv').html(''+data['question']+'<br/><br/><button id="checkAnswer" class="btn btn-default" style="margin-top: 6px">Check Answer</button><br/><br/>');
				$('#videobox').hide();
				$('#checkAnswer').click(function(){
					var checkedans = [];
					if($('#quizinput2').attr('type')=='radio' && $('#quizinput1').attr('type')=='textarea'){
						if($('textarea').val() == data['answer'][0] && $('input[name="option"]:checked').val() == data['answer'][1]){
							octopus.score = 1;
							$('#tipblock').html('<h4 style="color:green"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Great Job!</h4>');
						} else {
							octopus.score = 0;
							$('#tipblock').html('<h4 style="color:red"><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;Try Again</h4>');
						}
					}
					else if($('#quizinput1').attr('type')=='radio'){
						if($('input[name="option"]:checked').val() == data['answer'] || $('input[name="option"]:checked').val() == data['answer'][0] && $('input[name="option1"]:checked').val() == data['answer'][1]){
							octopus.score = 1;
							$('#tipblock').html('<h4 style="color:green"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Great Job!</h4>');
						} else {
							octopus.score = 0;
							$('#tipblock').html('<h4 style="color:red"><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;Try Again</h4>');
						}
					}
					else if($('.Checkboxinput').attr('type')=='checkbox'){
						var inputElements = document.getElementsByClassName('Checkboxinput');
						for(var i=0; inputElements[i]; ++i){
						      if(inputElements[i].checked)
						           checkedans.push(inputElements[i].value);
						}
						checkedans.sort();
						data['answer'].sort();
						if(checkedans.length!=data['answer'].length){
							octopus.score = 0;
							$('#tipblock').html('<h4 style="color:red"><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;Try Again</h4>');
						}
						else{
							for (var i = 0; i < checkedans.length; ++i) {
							    if (checkedans[i] != data['answer'][i]){
							    	octopus.score = 1;
							    	$('#tipblock').html('<h4 style="color:red"><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;Try Again</h4>');break;
							    }else{
							    	octopus.score = 0;
							    	$('#tipblock').html('<h4 style="color:green"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Great Job!</h4>');
							    }
							}
						}
					}
					else{
						for (var i = 1; i <= data['answer'].length; i++) {
							if($('#quizinput'+i).val() == data['answer'][i-1]){
								octopus.score = 1;
								$('#tipblock').html('<h4 style="color:green"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Great Job!</h4>');
							} else {
								octopus.score = 0;
								$('#tipblock').html('<h4 style="color:red"><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbsp;Try Again</h4>');
							}
						}
					}
				});
				$('#btnNext2').click(function(){
					//alert("Clicked Next");
					octopus.stroreData();
					var ipc = require('ipc');
					if(parseInt(les1)+1 <= lessonSize){
						//location.href="module?mod="+mod1+'&les='+(parseInt(les1)+1);
						ipc.send('asynchronous-message', "\\module.html?mod="+mod1+"&les="+(parseInt(les1)+1));
						console.log('done to NEXT');
					} else {
						//location.href="course";
						ipc.send('asynchronous-message', "\\course.html");
						console.log('done to COURSE');
					}
				});
				$('#btnPrev2').click(function(){
					//alert("Clicked Previous");
					var ipc = require('ipc');
					if(parseInt(les1)-1 >= 1){
						//location.href="module?mod="+mod1+'&les='+(parseInt(les1)-1);
						ipc.send('asynchronous-message', "\\module.html?mod="+mod1+"&les="+(parseInt(les1)-1));
						console.log('done to NEXT');
					} else {
						//location.href="course";
						ipc.send('asynchronous-message', "\\course.html");
						console.log('done to COURSE(PREV)');
					}
				});
			}
			$('#tipblock').html(data['tips']);
			
			//Side-Bar Links Creation
			for(var i=1; i <= data["syllabus"].length; i++){
				if(i==mod1){
					$('#sidebarlist').append('<li class="active"><a href="module.html?mod='+i+'&les=1">'+data["syllabus"][i-1]+'</a></li>');
				} else{
					$('#sidebarlist').append('<li><a href="module.html?mod='+i+'&les=1">'+data["syllabus"][i-1]+'</a></li>');
				}
			}
					
			
		},
		stroreData: function(){
			var ipc = require('ipc');
			console.log("qid"+this.qid+"st:"+this.startTime+"smt:"+this.submittedTime+"score:"+this.score);
			var record={"qid":this.qid,"startTime":this.startTime,"submittedTime":this.submittedTime,"score":""+this.score};
			ipc.send('process-data',record);
		},
		getStartTime: function(){
			var date=new Date();
			var strd=date.toString();
			octopus.startTime=strd.substring(0,strd.indexOf("GMT"));//Date.now();
			return this.startTime;
		},
		getQuestionId:function(data, mod1, les1, lessonSize){
			octopus.qid=data["lessons"][les1-1]["qid"];
			return this.qid;
		}
	};
	
	octopus.init();
});