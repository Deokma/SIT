var requestAnimFrame = (function(){
   return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
 })();
 
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
//var canvas1 = document.getElementById("canvas1");

var paddleHeight = 100;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = (canvas.height-paddleHeight)/2;

var radius = 32;
var lineWidth = 4;
var gravity = 0.1;
var dampening = 0.995;
var mousePullStrength = 0.005;
var animate = false;
 var mouse = {
  x : 0,
  y : 0,
  down: false
};

 var circle = {
  x : canvas.width/2 + 100,
  x1 : canvas.width/2,
  y : canvas.height/2 + 100,
  y1 : canvas.height/2,
  vx: 0, // 'v' stands for 'velocity'
  vy: 0
};
var circle2 ={
  x: canvas.width - 800,
  x1: canvas.width - 1200,
  y: canvas.height/2,
  y1: canvas.height - 600,
  vx: 0, // 'v' stands for 'velocity'
  vy: 0
}


function drawBox(){
    c.lineWidth = 1;
    c.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
   /* g = c.strokeRect(600, 150, canvas.width - 1200, canvas.height - 550);*/
  }
   function drawCircle(){
    c.beginPath();
    c.arc(circle.x, circle.y, radius - lineWidth/2, 0 , 2 * Math.PI, false);
    c.fillStyle = '00F0FF';
    c.fill();
    c.lineWidth = 4;
    c.strokeStyle = 'black';
    c.stroke();
  }
  function drawPaddle() {
    c.beginPath();
    c.rect(paddleX+10, (canvas.height/2)+40 - paddleHeight, paddleWidth, paddleHeight);
    c.fillStyle = "00F0FF";
    c.fill();
    c.closePath();
  }
  /*function drawcircler(){
    c.beginPath();
    c.arc(circle2.x,circle2.y, radius - lineWidth/2, 0 ,2 * Math.PI);
    c.fillStyle = '00F0FF';
    c.fill();
    c.lineWidth = 4;
    c.strokeStyle = 'black';
    c.stroke();
  }*/

  function drawLineToMouse(){
    c.lineWidth = 2;
    c.moveTo(circle.x, circle.y);
    c.lineTo(mouse.x, mouse.y);
    c.stroke();
  }

  function executeFrame(){
    if(animate)
      requestAnimFrame(executeFrame);
    incrementSimulation();
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawBox();
    
    drawCircle();
   // drawcircler();
    drawPaddle();
    if(mouse.down)
      drawLineToMouse();
  }

  function incrementSimulation(){
    // Перетащите круг по направлению к мыши
    if(mouse.down){
      var dx = mouse.x - circle.x,
          dy = mouse.y - circle.y,
          distance = Math.sqrt(dx*dx + dy*dy),
          unitX = dx / distance,
          unitY = dy / distance,
          force = distance * mousePullStrength;
      circle.vx += unitX * force;
      circle.vy += unitY * force;
    }
   
    // Выполнить гравитацию
    circle.vy += gravity;
   
    // Выполните демпфирование (замедление)
    circle.vx *= dampening;
    circle.vy *= dampening;
   
    // Увеличьте положение на скорость
    circle.x += circle.vx;
    circle.y += circle.vy;
   
    // Отскакивает от пола
    if(circle.y + radius > canvas.height){
      circle.y = canvas.height - radius;
      circle.vy = - Math.abs(circle.vy);
    }
    // Отскакивает от потолка
    else if(circle.y - radius < 0){
      circle.y = radius;
      circle.vy = Math.abs(circle.vy);
    }
    // Отскакивает от правой стены
    if(circle.x + radius > canvas.width){
      circle.x = canvas.width - radius;
      circle.vx = - Math.abs(circle.vx);
    }
    // Отскакивает от левой стены
    else if(circle.x - radius < 0){
      circle.x = radius;
      circle.vx = Math.abs(circle.vx);
    }
///////////////////////////////////////////////
    if(circle.x > paddleX && circle.x < paddleX + paddleWidth+40 && circle.y > paddleY && circle.y < paddleY + paddleHeight) {
      circle.vx = -circle.vx;
    }
    /*if(circle.y > paddleY && circle.y < paddleY + paddleHeight) {
      circle.vy = -circle.vy;
    }*/
///////////////////////////////////////////////
  }

  canvas.addEventListener('mousedown',function(e){
    mouse.down = true;
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  });
   canvas.addEventListener('mousemove', function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  });
   canvas.addEventListener('mouseup', function(e){
    mouse.down = false;
  });
   // Начните анимацию, когда мышь войдет в холст
  canvas.addEventListener('mouseover', function(e){
    animate = true;
    executeFrame();
  });
   // Прекратите анимацию, когда мышь выйдет из холста
  canvas.addEventListener('mouseout', function(e){
    mouse.down = false;
    animate = false;
  });
 
  executeFrame(); 