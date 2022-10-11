console.log("Testing starts....!");

var a = 10;
var b = 20;
var c = 30;

function add() {
    var sum = a + b + c;
    return sum;
}

function sub() {
    var minus = a - b - c;
    return minus;
}
setTimeout(function(){
    console.log("tested....................................")
}, 5000);
var res1 = add();
sub();
console.log("Result of ADD function :: ",res1);
console.log("Result of SUB function :: ",sub());