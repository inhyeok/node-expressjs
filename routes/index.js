var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'people'
});

/* GET home page. */

router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {  
    connection.query('SELECT id, name FROM artists', function(err, rows) {
      if(err) console.log(err);
      res.render('index', {title: 'profile', artist_list: rows});
      connection.release();
    });
  });
});

module.exports = router;