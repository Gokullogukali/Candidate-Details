var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var handler = require("./handler");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yournewpassword',
    database: 'nodelogin'
});

connection.connect(function (err, res) {
    if (err) {
        console.log("DB error :: ", err);
    }
    if (res) {
        console.log("DB connected successfully..");
    }
});

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get('/', function (request, response) {
    console.log("kdfgnjkhdf :: ", __dirname);
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {

                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();

    }
});

app.get('/getUsers', function (request, response) {

    connection.query('SELECT * FROM users', [], function (error, results, fields) {
        if (results.length > 0) {

            response.send(results);
        } else {
            response.send('No data');
        }
        response.end();
    });

});

app.delete('/deleteUser/:id', function (req, res) {
    var id = req.params.id;
    connection.query('delete from users where id=?', [id], function (error, results, field) {
        if (error) {
            let result = {
                message: error.message
            }
            res.send(result);
        }
        if (results) {
            let result = {
                message: "SUCCESS",
                id: results.insertId
            }
            res.send(result);
        }
    });
});

app.get('/home', function (request, response) {
    if (request.session.username) {
        // string, obj, arr, num <= send
        response.sendFile(path.join(__dirname + '/home.html'));
        //    var obj = {} ;
        //    response.send();

    } else {
        response.send('Please login to view this page!');
    }

    // response.end();
});

app.post('/user', function (req, res) {
    var b = req.body;
    var firstname = b.firstname;
    var lastname = b.lastname;
    var fullname = firstname + lastname;
    var email = b.email;
    var mobile = b.mobile;
    var address = b.address;
    var username = b.username;
    var password = b.password;
    var status = "active";

    var query = `insert into users (firstname,lastname,fullname,email,mobile,address,username,password,status)
values(?,?,?,?,?,?,?,?,?)`;
    connection.query(query, [firstname, lastname, fullname, email, mobile, address, username, password, status], function (err, results) {
        if (err) {
            res.send(err);
        }
        if (results) {
            let result = {
                Record: "Gokul Registration Details Inserted Successfully",
                id: results.insertId
            }
            res.send(result);
        }
    })

})
app.get('/register', function (req, res) {
    
    res.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/test', handler.add);
app.get('/test2', handler.sub);


app.listen(5000, function () {
    console.log("App started...")
});