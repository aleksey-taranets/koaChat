"use strict";
const app = require('koa')();
const route = require('koa-route');
const mongoose = require('mongoose');
const koaStatic = require('koa-static');
const parse = require('co-body');

const User = require('./models/user');

const config = require('./config')
mongoose.connect(config.dbUrl);

app.use(koaStatic(__dirname + '/public'));

app.use(route.post('/api/register', function *(next){

    var data = yield parse.form(this);

    if (!data.username || !data.password) {
        this.status = 400;
        this.body = JSON.stringify({error:'Invalid user data'});
    } if (data.password !== data.password_confirmation) {
        this.status = 400;
        this.body = JSON.stringify({error:'Passwords do not match'});
    } else {

        try {

            let user = new User({
                username: data.username,
                password: data.password
            });
            let saveResult = yield user.save();

            this.status = 201;
            this.body = JSON.stringify({id: saveResult._id});

        } catch (err) {
            this.status = 409;
            this.body = JSON.stringify({error: 'Already registered'});
        }

    }
}));

app.use(route.post('/api/login', function *(next){

    var data = yield parse.form(this);

    if (!data.username || !data.password) {
        this.status = 400;
        this.body = JSON.stringify({error:'Invalid user data'});
    } else {

        try {
            let user = yield User.findOne(data);

            this.status = 200;
            this.body = JSON.stringify({id: user._id});

        } catch (err) {
            this.status = 404;
            this.body = JSON.stringify({error: 'Bad username or password'});
        }

    }
}));

const port = process.env.PORT || config.port;
app.listen(port);


