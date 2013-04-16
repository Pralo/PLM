var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

MongoD = function(host, port) {
  this.db = new Db('MongoDataBase', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//getCollection

MongoD.prototype.getCollection= function(callback) {
  this.db.collection('test', function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

//createNewAccount
MongoD.prototype.createAccount = function(userInfo, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.insert({  'user': userInfo.user,'password': userInfo.password, 'email': userInfo.email  }, function() {
          callback(null, userInfo);
        });
      }
    });
};

//changePassword
MongoD.prototype.changePassword = function(userInfo, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.update({ 'email': userInfo.email}, {'email' :userInfo.email, 'password': userInfo.password }, function() {
          callback(null, userInfo);
        });
      }
    });
};

exports.MongoD = MongoD;