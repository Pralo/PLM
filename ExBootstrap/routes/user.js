exports.list = function(req, res){
  res.send("Test Exports.List in User.Js");
};

exports.profile = function(req, res){
	if(req.cookies.user == null || req.cookies.user == "")
	{
		res.redirect('/');
	}
	else{
	     var data = {
      title: 'Profile',
      email: req.cookies.user
   };
   res.render('profile',data);	
};}

exports.signup = function(req,res){
   var data = {
      title: 'Sign up',
      information: 'Form - Create New Account'
   };
   res.render('login',data);
};	
exports.changePwd = function(req,res){
   var data = {
      title: 'Sign up',
      information: 'Form - Change Password'
   };
   res.render('login',data);
};	
exports.resetPwd = function(req,res){
   var data = {
      title: 'Reset Password',
      information: 'Form - Reset Password'
   };
   res.render('reset',data);
}; 