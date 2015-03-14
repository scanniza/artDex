var express = require('express');
var passport = require('passport');
var router = express.Router();
var multer  = require('multer');
var Sighting = require('../models/sighting');
var Auth = require('./auth');
// var app = express();
// var done=false;


// app.use(multer({ dest: './uploads/',
//  rename: function (fieldname, filename) {
//     return filename+Date.now();
//   },
// onFileUploadStart: function (file) {
//   console.log(file.originalname + ' is starting ...')
// },
// onFileUploadComplete: function (file) {
//   console.log(file.fieldname + ' uploaded to  ' + file.path)
//   done=true;
// }
// }));

// router.post('/api/photo',function(req,res){
// 	//console.log("req: ",req);
//   if(done==true){
//     console.log(req.files);
//     res.end("File uploaded.");
//   }
// });

router.get('/',Auth.loggedIn,function(req,res){
      res.render('upload');
  });

router.post('/api/photo',function(req,res){
	if(req.user){
	    console.log("req: ",req);
	    var taxonId = 101656;
	    var location = {coordinates:[0,0]};
	    var path = req.files.userPhoto.path;
	    var newSighting = new Sighting({user:req.user._id, taxonId:taxonId, imagePath:path,location:location});
	    newSighting.save(function(err,sighting){
	    	if(req.user.animalOfDay==taxonId){
	    		updatePoints(req.user,100,function(req,res){
	    			res.send(sighting);
	    		});
	    	}
	    	else{
	    		updatePoints(req.user,5,function(req,res){
	    			res.send(sighting);
	    		});
	    	}
		});
	}
	else
		res.redirect(201,'/');
});


router.post('/report', Auth.loggedIn, function(req, res) {
	var taxon = req.body.taxon;
	var image
});

function updatePoints(user,points,callback){
	user.exp = user.exp + points;
	while(user.exp>user.level*10){
		user.exp = user.exp - user.level*10;
		user.level++;
	}
	user.save(function(err,user){
		if(err) console.log(err);
		callback();
	});
}

module.exports = router;