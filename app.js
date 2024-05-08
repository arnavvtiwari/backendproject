const express = require('express');
const app = express();
const userModel = require('./models/users.models');
const postModel = require('./models/post.models');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/logout', (req, res) => {
    res.cookie('token','');
    res.redirect('/login');
})
app.get('/profile',isLoggedin, (req, res) => {
    console.log(req.user)
    res.render('index');
})


app.post('/login', async (req, res) => {
    let {  name, email } = req.body;
    let user = await userModel.findOne({ email});
    if(!user){
        res.status(400).send('User does not exist');
    }
    else{
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result){
                const token=jwt.sign({email:email, userid:user._id},"secret")
                res.cookie("token",token)
                res.send('User logged in');
            }
            else{
                res.status(400).send('Password incorrect');
                res.redirect('/login');
            }
        })
    }
});
app.post('/register', async (req, res) => {
    let { username, name, email, password, age } = req.body;
    let user = await userModel.findOne({ email});
    if(user){
        res.status(500).send('User already exists');
    }
    else{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                let user = await userModel.create({
                    username,
                    name,
                    email,
                    password: hash,
                    age,
                });
                const token=jwt.sign({email:email, userid:user._id},"secret")
                res.cookie("token",token)
                res.send('User created');
            });
        });
    }
});


function isLoggedin(req,res,next){
    if(req.cookies.token === "") {
        res.send("You are not logged in")
    }
    else{
        let data = jwt.verify(req.cookies.token,"secret")
        req.user = data
    }

    next()
}   

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
