var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var db_str = 'mongodb://localhost:27017/users'

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.post('/form', function(req, res, next) {
	var account = req.body['account']
	var psw = req.body['password']
	var insertData = function(db, callback) {
		var conn = db.collection('info')
		var data = [{ username: account, psw: psw }]
		conn.insert(data, function(err, result) {
			if(err) {
				console.log('插入失败')
			} else {
				callback(result)
			}
		})
	}
	mongodb.connect(db_str, function(err, db) {
		if(err) {
			console.log('链接失败')
		} else {
			console.log('success')
			if(account !== '' && psw !== '') {
				insertData(db, function(result) {
					console.log(result)
					res.redirect('/');
					db.close();
				})
			}

		}
	})

})

router.post('/login', function(req, res, next) {
	var account = req.body['account']
	var psw = req.body['password']

	var findData = function(db, callback) {
		var conn = db.collection('info')
		var data = { username: account, psw: psw }
		conn.find(data).toArray(function(err, result) {
			if(err) {
				console.log('插入失败')
			} else {
				callback(result)
			}
		})
	}
	mongodb.connect(db_str, function(err, db) {
		if(err) {
			console.log('链接失败')
		} else {
			console.log('success')
			findData(db, function(result) {
				if(result.length > 0) {
					req.session.user = result[0].username
					res.redirect('/')
					db.close()
				} else {
					res.redirect('/error')
					db.close()

				}
			})
		}
	})
})

//留言上传服务器

router.post('/liuyan', function(req, res, next) {
	var title = req.body['title']
	var content = req.body['content']
	var insertData = function(db, callback) {
		var conn = db.collection('liuyan')
		var data = [{ bt: title, nr: content }]
		conn.insert(data, function(err, result) {
			if(err) {
				console.log('插入失败')
			} else {
				callback(result)
			}
		})
	}
	mongodb.connect(db_str, function(err, db) {
		if(err) {
			console.log('链接失败')
		} else {
			console.log('success')
			insertData(db, function(result) {
				console.log(result)
				res.redirect('/liuyan');
				db.close();
			})
		}
	})

})
//博客上传服务器
router.post('/sendblog',function(req,res,next){
	var title = req.body['title']
	var content = req.body['content']
	console.log(req.session.user)
	var insertData = function(db, callback) {
		var conn = db.collection('blog')
		var data = [{ bt: title, nr: content,name:req.session.user }]
		conn.insert(data, function(err, result) {
			if(err) {
				console.log('插入失败')
			} else {
				callback(result)
				console.log(result)
			}
		})
	}
	mongodb.connect(db_str, function(err, db) {
		if(err) {
			console.log('链接失败')
		} else {
			console.log('success')
			insertData(db, function(result) {
				console.log(result)
				res.redirect('/blog');
				db.close();
			})
		}
	})
	
})

module.exports = router;

//获取模块
var mongodb = require('mongodb');
//创建数据库连接
var server = new mongodb.Server(
	'localhost', 27017, { auto_reconnect: true }
	//自动重新连接数据库
)
//数据库连接
var db = new mongodb.Db(
	'users', server, { safe: true }
)
//测试连接
var arrname = [];
var arrpsw = []
db.open(function(err, db) {
	if(err) {
		console.log(err)
	} else {
		console.log('success')
		db.collection('info', { safe: true }, function(err, data) {
			if(err) {
				console.log(err)
			} else {
				data.find({}).toArray(function(err, res) {
					if(err) {
						console.log('失败')
					} else {
						res.forEach(function(value) {
							arrname.push(value.username)
							arrpsw.push(value.psw)
						})
					}
				})
			}
		})
	}
})