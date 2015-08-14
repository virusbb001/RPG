var game,player,backgroundMap,mob,commands,mob2,spike,stair;
var map_manager;
// 最初のマップ
var map_start;
var sumFPS=0;
var pause_scene,pause_text;
// キャラクター用配列
// var characterList=new CharactersList();
var paused=false;

function toggle_pause(){
 var message_list=
  ([
   "GAME PAUSED",
   /*
   "HELP",
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
   */
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
 game.preload('font0.png','images/chara0.png','images/chara5.png','images/map1.png','images/map0.png');
 game.keybind(27,"pause");
 game.keybind(90,"Z"); // Z
 game.keybind(88,"X"); // X
 game.keybind(67,"C"); // C

 map_manager.set_core(game);

 // onload
 // プリロード
 game.onload=function(){
  game.rootScene.backgroundColor="#000000";
  register_maps(game);
  map_manager.move_player(["F1"],1,1);
  player=game.currentScene.player;

  // ポーズ設定
  pause_scene=new Scene();
  pause_text=new MutableText(0,game.height/2-16/2,game.width);
  pause_text.setText("GAME PAUSED");
  pause_scene.backgroundColor="rgba(0, 0, 0, 0.5)";
  pause_scene.addChild(pause_text);

  // 最初のメッセージ表示
  /*
  player.pushCommand(new player.waitMessage(player,{messages:[
     "[Zキーを押して次に進む]",
     "デモ版\"RPG\"にようこそ",
     "このゲームでは\n塔の頂上を目指すことです",
     "マップのどこかにある\n階段に乗ると、\n上に行くことが出来ます",
     "では、頑張ってください！",
     "カーソルキー(←↓↑→)で\n上下左右に移動します"]})
  );
  */
 }

 game.addEventListener('pausebuttondown',function(){
  toggle_pause();
 });
 // game.debug();
 game.start();
});

function getGameObj(){
 return game;
}

// コマンドオブジェクト生成
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
   player.queue.forEach(function(cmd,index){
    self.echo(index+" : "+cmd.toString());
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
  walk: function(){
   var directionStr=["down","left","right","up"];
   if(arguments.length<1 || arguments[0] == "help"){
    this.echo("walk *direction* [times]")
    this.echo("歩くコマンドを追加する");
    this.echo("引数");
    this.echo("direction down: 下 left: 左 right: 右 up: 上");
    this.echo("times: 回数\n\tデフォルト: 1\n\t0は1として扱われる");
   }else{
    var direction=arguments[0]-0;
    var times=arguments[1] || 1;
    if(isNaN(direction)){
     direction=directionStr.indexOf(arguments[0].toLowerCase());
    }

    if(direction < 0 || 3< direction){
     this.echo("方向の指定がおかしい");
    }else if(times<0){
     this.echo("回数に負の値は指定できない");
    }else{
     for(var i=0;i<times;i++){
      player.pushCommand('walk',{direction: direction});
     }
     this.echo("walk "+directionStr[direction]+"を"+(times > 1 ? times +"回": "") + "追加" );
    }
   }
  },
  watch: function(){
   player.pushCommand("watch",{});
  }
 };

 return termObj;
}

function mes_debug_array(){
 var message=[];
 for(var i=0;i<arguments.length;i++){
  message.push(arguments[i]);
 }
 return message;
}
