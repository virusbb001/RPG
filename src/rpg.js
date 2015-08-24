var game,map_manager,commands;

// 最初のマップ
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

function game_over(){
 var gameover_scene=new Scene();
 gameover_scene.backgroundColor="rgba(255,0,0,0.5)";
 gameover_text=new MutableText(0,game.height/2-16/2,game.width);
 gameover_text.setText("GAME OVER");
 gameover_scene.addChild(gameover_text);
 game.pushScene(gameover_scene);
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

function mes_debug_array(){
 var message=[];
 for(var i=0;i<arguments.length;i++){
  message.push(arguments[i]);
 }
 return message;
}
