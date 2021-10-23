if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const User = require('./models/users');

// const optRouter = require('./views/option')
// const loginRouter = require('./views/login')
// const registerRouter = require('./views/register')

app.set('view engine','ejs')

app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({limit:'10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection

db.on('error',error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


// app.use('/', optRouter)
// app.use('/login', loginRouter)
// app.use('/register', registerRouter)

app.use('/home', indexRouter)

app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.get('/', (req, res)=> {
    res.render("option")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.get("/login", (req, res)=> {
    res.render("login")
})

app.post("/register", function (req, res) {
    console.log(req.body);
    let user_name = req.body.name;
    let user_email = req.body.email;
    let user_address = req.body.address;
    let user_password = req.body.password;

    const user = new User({
        name: user_name,
        email: user_email,
        address: user_address,
        password: user_password,
    });

    user.save();
    res.redirect("/login");
});

app.post("/login", function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password == password) {
            
                    res.redirect("/home");
                } else {
                    msg = "Incorrect email or password";
                    res.redirect("/login");
                }
            }
        }
    });
});




app.listen(process.env.PORT || 3000);