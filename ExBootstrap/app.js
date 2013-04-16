var express = require('express')
  , app = express()
  , routes = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http').createServer(app)
  , sio = require('socket.io').listen(http)
  , nodeMailer = require("nodemailer")
  , crypto = require("crypto")
  , MongoD = require('./models//mongodb').MongoD
  , path = require('path');

var mD = new MongoD('localhost', 27017);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
    //res.cookie(name, value, { expires: new Date() + 90000000, maxAge: 90000000});
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
    
app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.signup); 
app.get('/you', routes.youtube); 
app.get('/io', routes.socket); 
app.get('/login', routes.login);
app.get('/users', user.list);
app.get('/users/:name', user.profile);

//Create Account Or Reset Password
app.post('/signup/', function(req, res) {
  var type = req.body.btnDo;
  if(type == 1)
  {
      var Vemail = req.body.inputEmail;
      mD.createAccount(
      {
          email: Vemail ,
          password: req.body.inputPassword
      } , function( error, docs) {
              res.cookie('email', Vemail, {maxAge: 600000});
              res.redirect('/users/' + Vemail);
         });
  }
  else if(type == 2)
  {
    user.resetPwd(req,res);
  }
  else
  {
    res.redirect('/signup/');
  }
});

app.post('/users/changepwd/',function(req, res) {
  if(req.body.inputPwd1 == req.body.inputPwd2)
  {
    mD.changePassword(
      {
       email: req.cookies.email,
        password: req.body.inputPwd1
      } , function( error, docs) {
              res.redirect('/users/' + req.cookies.email);
         });
  }
  else
  {
    res.redirect('/users/'+ req.cookies.email);
  }
});

app.post('/users/resetpwd/',function(req, res) {
  var newPwd = (crypto.createHash('md5').update(Math.random()+"").digest("hex"))

    mD.changePassword(
      {
       email: req.body.inputEmail,
        password: newPwd
      } , function( error, docs) {
              res.redirect('/users/' + req.cookies.email);
         });

  nodeMailer.createTransport("SMTP",
  {
      service: "Gmail",
      auth: {
          user: "Send.Mail.Express@gmail.com",
          pass: "TestBinah123"
            }
  }).sendMail(
  {
      from: "Send Mail ✔ <Send.Mail.Express@gmail.com>",
      to: req.body.inputEmail, 
      subject: "Password Recovery", 
      text: "New Password :" + newPwd , 
      html: "<b>New Password :"+newPwd+"</b>" 
  }
  , function(error, res){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + res.message);
      }
  });
            res.redirect('/signup/');
  });

sio.sockets.on('connection', function(socket) {
  socket.on('join', function(channel, ack) {
    socket.get('channel', function(err, oldChannel) {
      if (oldChannel) {
        socket.leave(oldChannel);
      }
      socket.set('channel', channel, function() {
        socket.join(channel);
        socket.broadcast.to(channel).emit('broadcast', "New User in channel!")
        ack();
        console.log("New user in channel :" + channel);
      });
    });
  });
  
  socket.on('message', function(msg, ack) {
    socket.get('channel', function(err, channel) {
      if (err) {
        socket.emit('error', err);
      } else if (channel) {
        socket.broadcast.to(channel).emit('broadcast', msg);//All but sender
        ack();
        console.log(msg);
      } else {
        socket.emit('error', 'no channel');
      }
    });
  });
});


http.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
