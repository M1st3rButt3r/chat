const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const { v4 : uuidv4 } =  require('uuid');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat"
})

connection.connect(function(err) {
    if(err) throw err
    else console.log("Connected")
})

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/signin', (req, res) => {
    res.render('signin.ejs');
})

app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

app.post('/signin', (req, res) => {

})

//handle post requests to directory /signup
app.post('/signup', async (req, res) => {

    //check if password and password repeat are equal
    if(req.body.password !== req.body.passwordrepeat) {
        res.redirect('/signup');
        console.log("passworrds are not equal");
        return;
    }
    //check if password is long enough
    else if(req.body.password.length < 8) {
        res.redirect('/signup');
        console.log("not long enough");
        return;
    }
    var tag = 0;
    //generate the tag
    var sql = 'SELECT * FROM user WHERE name="'+req.body.name+'"'
    connection.query(sql, function(err, result) {
        if(err) throw err
        else 
        {
            tag = result.length
            console.log(tag);

            if(tag > 9999)
            {
                res.redirect('/signup')
                console.log("username taken")
                return;
                
            }
            else
            {
                tag = tag + 1000
                tag = tag.toString()
            }
        }
    })
    
    //pass the user into the database
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        var sql = 'INSERT INTO user (name, tag, password) VALUES ("'+req.body.name+'","'+tag+'","'+hashedPassword+'")'
        connection.query(sql, function(err, result) {
            if(err) throw err
            else console.log("Inserted user")
        })
        res.redirect('/signin')
    } catch(err) {
        if(err) throw err
        res.redirect('/signup')
    }
})

app.listen(3000)