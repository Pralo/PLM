exports.login = function(req,res){
   var data = {
      title: 'Login Page',
      information: 'Please Login for Access Your Account'
   }
   res.render('login',data);
}

exports.youtube = function(req,res){
   var data = {
      title: 'Youtube API',
      information: 'Test with Youtube API'
   }
   res.render('youtube',data);
}

exports.socket = function(req,res){
   var data = {
      title: 'Socket Test',
      information: 'Test with Socket.IO'
   }
   res.render('socket',data);
}