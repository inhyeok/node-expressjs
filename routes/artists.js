var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'people'
});

/* GET users listing. */

router.param('artist_id', function (req, res, next, id) {
	if(!isFinite(+id)){
		return next(new Error('artist_id invalid'));
	}
	pool.getConnection(function(err, connection) {	
		connection.query('SELECT id, name, gender FROM artists WHERE id=?', +id, function(err, rows) {
			if(err) console.log(err);
			connection.release();
			
			if(rows.length === 0){
				return next(new Error('artist not found'));
			}
			
			req.artist = rows[0]
			next()
		});
	});
	// ...
	// res.locals.artist = {...}
	// req.artist = {...}

	// next()
})

router.post('/', function(req, res, next) {
	var name = req.body.name;
	var gender = req.body.gender;
	var artist = [name, gender];
	pool.getConnection(function(err, connection) {	
		connection.query('INSERT INTO artists(name, gender, created_at) VALUES (?,?,NOW())', artist, function(err, row) {
			if(err) console.log(err);
			res.redirect('/artists/'+row.insertId);
			connection.release();
		});
	});
});

router.get('/new', function(req, res, next) {
	res.render('new', { title: 'new' });
});

router.get('/:artist_id', function (req, res, next) {
	res.render('profile', {title: 'profile', artist: req.artist});
	
	// pool.getConnection(function(err, connection) {	
	// 	connection.query('SELECT id, name, gender FROM artists WHERE id=?', req.params.id, function(err, rows) {
	// 		if(err) console.log(err);
	// 		res.render('profile', {title: 'profile', artist: rows});
	// 		connection.release();
	// 	});
	// });
});

router.delete('/:artist_id', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		connection.query('DELETE FROM artists WHERE id=?', +req.artist.id, function (err, row){
			console.log(2);
			res.redirect('/');
			connection.release();
		});
	});
});

module.exports = router;