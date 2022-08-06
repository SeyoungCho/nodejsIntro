var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.search_result = function(request, response){
  var body = '';
  request.on('data', function(data){
    body += data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query(`SELECT * FROM topic WHERE title=?`, [post.search_title], 
      function(error, result){
        if(error){
          throw error;
        }
        if(result.length > 0){
          response.writeHead(302, {Location: `/?id=${result[0].id}`});
          response.end();
        }else{
          response.writeHead(404);
          response.end('No results');
        }
      });
  });
}