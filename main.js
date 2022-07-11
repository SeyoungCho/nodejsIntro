var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){ //home
        fs.readdir('./data', function(err, filelist){
          var title = 'Welcome'
          var description = "Hello, Node.js";

          /*
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
          <h2>${title}</h2>
          <p style="margin-top:45px;">
            ${description}
          </p>
          `, `
            <a href="/create">create</a>
          `)
          response.writeHead(200);
          response.end(template);
          */

          var list = template.list(filelist);
          var html = template.HTML(title, list, `
          <h2>${title}</h2>
          <p style="margin-top:45px;">
            ${description}
          </p>
          `, `
            <a href="/create">create</a>
          `)
          response.writeHead(200);
          response.end(html);
         })
      }
      else {
        fs.readdir('./data', function(err, filelist){
          var list = template.list(filelist);
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, content){
            var title = queryData.id;
            var html = template.HTML(title, list, `
              <h2>${title}</h2>
              <p style="margin-top:45px;">
                ${content}
              </p>
            `, `
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>
            `)
            response.writeHead(200);
            response.end(html);
          });
        })
      }
    }else if(pathname === '/create'){
      fs.readdir('./data', function(err, filelist){
        var title = 'WEB - Create'
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="Title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,``)
        response.writeHead(200);
        response.end(html);
       })
    }else if(pathname==='/create_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      })
    }else if(pathname === '/update'){
      fs.readdir('./data', function(err, filelist){
        var list = template.list(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, content){
          var title = queryData.id;
          var html = template.HTML(title, list, `
            <form action="http://localhost:3000/update_process" method="post">
            <input type="hidden" name="id" value=${title}>  
            <p><input type="text" name="title" value=${title}></p>
              <p>
                <textarea name="description" value=${content}></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `,``)
          response.writeHead(200);
          response.end(html);
        });
      })
    }else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        })
      })
    }else if(pathname==="/delete_process"){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        console.log(id);
        fs.unlink(`data/${id}`, function(err){
          response.writeHead(302, {Location: "/"});
          response.end();
        });
      })
    }else{
      response.writeHead(404);
      response.end('Not Found');
    }
  });
app.listen(3000);