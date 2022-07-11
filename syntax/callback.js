// function a(){
//   console.log('A');
// }
var a = function(){
  console.log('A');
}


function slowFunc(callback){
  console.log('slowfunc');
  callback();
}

slowFunc(a);