var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');
var search = require('./lib/search');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){ //home
        topic.home(request, response);
      }
      else { //상세페이지
        topic.page(request, response);
      }
    }else if(pathname === '/create'){
      topic.create(request, response);  //글 생성 페이지
    }else if(pathname==='/create_process'){
      topic.create_process(request, response);   //글 생성 내부 처리함수
    }else if(pathname === '/update'){
      topic.update(request, response);  //글 수정 페이지
    }else if(pathname === '/update_process'){
      topic.update_process(request, response);  //글 수정 내부 처리함수
    }else if(pathname==="/delete_process"){
      topic.delete(request, response);  //글 삭제 내부 처리함수
    }else if(pathname === "/author"){   
      author.home(request, response)    //저자 목록 홈
    }else if(pathname === "/author/create_process"){
      author.create_process(request, response); //저자 생성 내부 처리함수
    }else if(pathname === "/author/update"){
      author.update(request, response); //저자 수정 페이지
    }else if(pathname === "/author/update_process"){
      author.update_process(request, response);   //저자 수정 내부 처리함수
    }else if(pathname === "/author/delete_process"){
      author.delete_process(request, response); //저자 삭제 내부 처리함수
    }else if(pathname === "/search_result"){
      search.search_result(request, response);
    }else{
      response.writeHead(404);
      response.end('Not Found');
    }
  });
app.listen(3000);