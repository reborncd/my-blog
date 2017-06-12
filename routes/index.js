var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/users"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',user:req.session.user});
});
router.get('/register',function(req, res, next){
	res.render('register',{})
});
router.get('/login',function(req, res, next){
	res.render('login',{})
});
router.get('/out',function(req, res, next){
	req.session.destroy(function(err){
		if(!err){
			res.redirect('/')
		}
	})
})
router.get('/blog',function(req, res, next){
	var findData=function(db,callback){
			var conn=db.collection('blog')
			conn.find({name:req.session.user}).toArray(function(err,result){
				callback(result)
			})
		}	
		mongodb.connect(db_str,function(err,db){
			if(err){
				console.log('链接失败')
			}else{
				console.log(' success')
				findData(db,function(result){
					console.log(result)
					res.render('blog',{result:result,user:req.session.user})
				})	
			}
		})
});
router.get('/sendblog',function(req, res, next){
	res.render('sendblog',{})
});
router.get('/liuyan',function(req,res,next){
	
		var findData=function(db,callback){
			var conn=db.collection('liuyan')
			conn.find({}).toArray(function(err,result){
				callback(result)
			})
		}	
		mongodb.connect(db_str,function(err,db){
			if(err){
				console.log('链接失败')
			}else{
				console.log(' success')
				findData(db,function(result){
					console.log(result)
					res.render('liuyan',{result:result})
				})	
			}
		})		
})
router.get('/gallery',function(req,res,next){
	res.render('gallery',{})
})
//router.get('/delete',function(req,res,next){
//	console.log(req.session)
//	req.session.destroy(function(err){
//		console.log(req.session)
//		if(!err){
//			res.redirect('/liuyan')
//		}
//	})
//})
//router.get('/error',function(req, res, next){
//	res.render('error',{})
//});
module.exports = router;
