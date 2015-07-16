var game,player,backgroundMap,mob,commands,mob2,spike;
var map_start;
var sumFPS=0;
var pause_scene,pause_text;
// キャラクター用配列
// var characterList=new CharactersList();
var paused=false;

function toggle_pause(){
 var message_list=
  ([
//   "HELP",
   "GAME PAUSED",
   "LOL U DIED",
   "DISCONNECTED",
   "DISCONNECTED".split("").reverse().join(""),
   "ACCESS DENIED",
   "YOU LOSE",
   "GAME OVER",
   "PAUSE AHEAD",
   "TYPE THE COMMAND",
   "$ SHUTDOWN",
   "TOO COLD",
   "PING",
   "QUEUE",
   "FORGIVE ME"
  ]).filter(function(val,index,arr){
   return val.length<=(game.width/16);
  });

 if(paused){
  game.popScene();
  game.resume()
 }else{
  var text=message_list[Math.floor(Math.random()*message_list.length)];
  pause_text.setText(text);
  pause_text.x=game.width/2-text.length*16/2;
  game.pushScene(pause_scene);
  game.pause();
  window.parent.toggleConnect();
 }
 paused=!paused;
}

$(function(){
 game=new Game(16*16,16*16);
 lbl=new MutableText(0,0,game.width);

 game.fps=60;
 game.preload('font0.png','images/chara0.png','images/map1.png');
 game.keybind(27,"pause");

 // onload
 // プリロード
 game.onload=function(){
  backgroundMap = new Map(16, 16);
  backgroundMap.image = game.assets['images/map1.png'];
  backgroundMap.loadData([
    [64,64,23,23,23,23,23,23,64,64],
    [64,64,64,64,64,64,64,64,64,64],
    [7,64,64,23,64,23,23,64,64,7],
    [7,64,7,64,64,64,64,23,64,7],
    [7,64,23,64,64,64,64,64,64,7],
    [7,64,64,64,64,64,64,7,64,7],
    [7,64,23,64,64,64,64,23,64,7],
    [23,64,64,23,23,64,23,64,64,23],
    [64,64,64,64,64,64,64,64,64,64],
    [64,64,23,23,23,23,23,23,64,64]
   ],[
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,13,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ]);
  backgroundMap.collisionData = [
   [0,0,1,1,1,1,1,1,0,0],
   [0,0,0,0,0,0,0,0,0,0],
   [1,0,0,1,0,1,1,0,0,1],
   [1,0,1,0,0,0,0,1,0,1],
   [1,0,1,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,1,0,1],
   [1,0,1,0,0,0,0,1,0,1],
   [1,0,0,1,1,0,1,0,0,1],
   [0,0,0,0,0,0,0,0,0,0],
   [0,0,1,1,1,1,1,1,0,0]
  ];

  player=new Player(1,1);
  // 8ずらすことでキャラをマップ座標に居るように見せている
  var image=new Surface(96,128);
  image.draw(game.assets['images/chara0.png'],0,0,96,128,0,0,96,128);
  // 線を引く
  // 衝突判定枠
  for(i=0;i<12;i++){
   var x,y;
   x=(i%3)*32;
   y=Math.floor(i/3)*32;
   image.context.beginPath();
   image.context.moveTo(x+player.offsetX,y+player.offsetY);
   image.context.lineTo(x+player.offsetX+16,y+player.offsetY);
   image.context.lineTo(x+player.offsetX+16,y+player.offsetY+16);
   image.context.lineTo(x+player.offsetX,y+player.offsetY+16);
   image.context.lineTo(x+player.offsetX,y+player.offsetY);
   image.context.strokeStyle="#ff0000";
   image.context.stroke();
  }
  player.image=image;
  // characterList.addChild(player);

  mob = new MoveBot(0,0);
  mob2= new MoveBot(0,1);
  mobImage=new Surface(96,128);
  for(i=0;i<12;i++){
   var x,y;
   x=(i%3)*32;
   y=Math.floor(i/3)*32;
   mobImage.context.beginPath();
   mobImage.context.moveTo(x+mob.offsetX,y+mob.offsetY);
   mobImage.context.lineTo(x+mob.offsetX+16,y+mob.offsetY);
   mobImage.context.lineTo(x+mob.offsetX+16,y+mob.offsetY+16);
   mobImage.context.lineTo(x+mob.offsetX,y+mob.offsetY+16);
   mobImage.context.lineTo(x+mob.offsetX,y+mob.offsetY);
   mobImage.context.strokeStyle="#ff0000";
   mobImage.context.stroke();
  }
  mobImage.draw(game.assets['images/chara0.png'],96,0,96,128,0,0,96,128);
  mob.image=mobImage;
  mob2.image=mobImage;

  // スパイク
  spike=new Spike(2,2);

  // マップシーン
  map_start=new MapScene(player,backgroundMap);
  map_start.addCharacters(mob);
  map_start.addCharacters(mob2);
  map_start.addCharacters(spike);

  game.rootScene.backgroundColor="#000000";
  game.pushScene(map_start);
  /*
  game.rootScene.addEventListener('enterframe',function(e){
   // FPS計算
   sumFPS+=game.actualFps;
   if(game.frame%10==0){
    lbl.setText(""+Math.round(sumFPS/10));
    sumFPS=0;
   }
   characterList.sortY();
  });
  */

  // ポーズ設定
  pause_scene=new Scene();
  pause_text=new MutableText(0,game.height/2-16/2,game.width);
  pause_text.setText("GAME PAUSED");
  pause_scene.backgroundColor="rgba(0, 0, 0, 0.5)";
  pause_scene.addChild(pause_text);
 }

 game.addEventListener('pausebuttondown',function(){
  toggle_pause();
 });
 game.debug();
});

function getGameObj(){
 return game;
}

function termCommands(){
 var data={
  player: player,
  mob:mob,
  mob2: mob2,
  spike: spike
 };
 var termObj={
  objs: function(){
   for(i in data){
    this.echo(i);
   }
  },
  echo: function(){
   if(arguments.length==0){
    this.echo("echo [String]");
   }else{
    var term=this;
    Array.prototype.slice.call(arguments).forEach(function(i){
     term.echo(i);
    });
   }
  },
  where: function(){
   this.echo("(" + player.mapX + ", "+player.mapY+")");
  },
  commands: function(){
   for(i in commands){
    this.echo(i);
   }
  },
  help: function(){
   for(var i in termObj){
    this.echo(i);
   }
  },
  queue: function(){
   var self=this;
   player.queue.forEach(function(cmd){
    self.echo(cmd.cmdName);
   });
  },
  setTimeoutTest: (function(){
   var i;
   return function(self){
    if(typeof self==="undefined"){
     i=0;
     self=this;
    }
    i++;
    self.echo(i);
    if(i<5){
     setTimeout(arguments.callee,1000,self);
    }
   };
  })(),
 };

 return termObj;
}

