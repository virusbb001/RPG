
var map_manager;

map_manager=new MapManager();

// game.onload中でやる必要が有る
function register_maps(game){
 // 共通の画像

 var player_img=new Surface(96,128);
 var player_dummy=new Player(0,0);
 player_img.draw(game.assets['images/chara0.png'],0,0,96,128,0,0,96,128);
 // 線を引く
 // 衝突判定枠
 for(i=0;i<12;i++){
  var x,y;
  x=(i%3)*32;
  y=Math.floor(i/3)*32;
  player_img.context.beginPath();
  player_img.context.moveTo(x+player_dummy.offsetX,y+player_dummy.offsetY);
  player_img.context.lineTo(x+player_dummy.offsetX+16,y+player_dummy.offsetY);
  player_img.context.lineTo(x+player_dummy.offsetX+16,y+player_dummy.offsetY+16);
  player_img.context.lineTo(x+player_dummy.offsetX,y+player_dummy.offsetY+16);
  player_img.context.lineTo(x+player_dummy.offsetX,y+player_dummy.offsetY);
  player_img.context.strokeStyle="#ff0000";
  player_img.context.stroke();
 }
 // 最初のマップ
 (function(){
   var backgroundMap = new Map(16, 16);
   backgroundMap.image = game.assets['images/map1.png'];
   backgroundMap.loadData([
     [7,23,7,7,7,7],
     [7,64,23,23,23,7],
     [7,64,64,64,64,7],
     [23,23,23,23,23,23]
    ],[
     [-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1]
   ]);
   backgroundMap.collisionData = [
    [1,1,1,1,1,1],
    [1,0,1,1,1,1],
    [1,0,0,0,0,1],
    [1,1,1,1,1,1]
   ];
   var player=new Player(1,1);
   var stair=new Stair(4,2,0,0,"F2");
   var debug={
    player:player,
    stair:stair
   }
   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(stair);

   player.image=player_img;

   map_manager.add_map("F1",map_scene);

 })();

 // F2登録
 (function(){
   var backgroundMap = new Map(16, 16);
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
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
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

  var player=new Player(1,1);
  var mob = new MoveBot(2,1);
  var spike=new Spike(1,2);
  var stair=new Stair(4,5,1,1,"F1");

  var debug={
   player: player,
   mob: mob,
   spike: spike,
   stair: stair
  }

  var map_scene=new MapScene(player,backgroundMap);

  // プレイヤー以外のオブジェクト追加
  map_scene.addCharacters(mob);
  map_scene.addCharacters(spike);
  map_scene.addCharacters(stair);

   backgroundMap.image = game.assets['images/map1.png'];
   player.image=player_img;

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

  map_manager.add_map("F2",map_scene);
 })();
};
