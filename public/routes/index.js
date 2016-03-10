var express 	= require('express');
var async		= require('async');
var Evernote 	= require('evernote').Evernote;
var redis 		= require('redis');
var router 		= express.Router();
var config		= require("../../app/config/apiAccess");

var evernoteKey = "evernoteNotes";

var redisClient = redis.createClient();//Redis Client
redisClient.on('connect', function(){
	console.log('Redis Connected.');
});

router.use(function(req, res, next){
	//Do logging
	console.log(req.method, req.url);
	next();
});

router.get("/", function(req, res){
	res.render('pages/index');
});

router.get("/getEvernote", function(req, res){
	redisClient.exists(evernoteKey, function(err, reply){
		if(reply === 1){
			redisClient.get(evernoteKey, function(err, string){
				console.log("evernote from cache");
				var notesObject = JSON.parse(string);
				res.render('partials/evernote', {
					notes: notesObject
				});
			});
		} else {
			console.log("evernote from call");
			getEvernoteNotes(req, res);
		}
	});

	return true;
});

function getEvernoteNotes(req, res){
	//Connect to Evernote to retrieve my notes
	var client = new Evernote.Client({
		token: config.evernoteToken,
		sandbox: false
	});
	
	var filter = new Evernote.NoteFilter;
	filter.notebookGuid = "7432e84c-6967-46aa-abb1-a14f093579f8";
	var spec = new Evernote.NotesMetadataResultSpec;
	spec.includeTitle = true;
	spec.includeCreated = true;
	spec.includeTagGuids = true;
	var noteStore = client.getNoteStore();
	var noteList = [];
	var noteContent = [];

	//Handling all the evernote async calls
	async.series([
		function(callback){
			noteStore.findNotesMetadata(filter, 0, 30, spec, function(err, notes){
				if (err){
					callback(err);
				}
				noteList = notes.notes;
				callback();
			});
		},
		function(callback){
			async.each(noteList, function(noteMeta, taskCallback){
					noteStore.getNoteContent(noteMeta.guid, function(err, content){
						if(err){
							taskCallback(err);
							return;

						}
						noteContent.push({title: noteMeta.title, content: content});
						taskCallback();
					});
			}, function(err){
				if (err){
					callback(err);
					return;
				}
				callback();
			});
		}
	], function(err){
		if (err) return console.log(err);
		var notesObject = [];
		for(var i=0; i<noteContent.length; i++){
			var temp = noteContent[i].content.split("<en-note>");
			var final = temp[1].split("</en-note>");
			notesObject.push({title: noteContent[i].title, content:final[0]});
		}
		var notesJSON = JSON.stringify(notesObject);
		redisClient.set('evernoteNotes', notesJSON);
		res.render('partials/evernote', {
			notes: notesObject
		});
	});
}

module.exports = router;