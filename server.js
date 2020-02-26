const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

// importing routes
const users = require('./routes/api/users');
const profile = require('./routes/api//profile');
const posts = require('./routes/api/posts');
const likes = require('./routes/api/likes');


const app = express();

// Ensble CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS, DELETE, PUT,PATCH"
    );
    next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport.js')(passport);

// use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/likes', likes);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`))