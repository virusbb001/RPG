
var map_manager;

map_manager=new MapManager();

// game.onload中でやる必要が有る
function register_maps(game){
 var surface_tmp;

 // 共通の画像
 var images={}
 // プレイヤー用
 images.player=game.assets['images/chara5.png'];

 // move_bot
 surface=new Surface(32*3,32*4);
 surface.draw(game.assets['images/chara0.png'],0,0,32*3,32*4,0,0,32*3,32*4);
 images.moveBotA=surface;

 // 看板用
 surface=new Surface(16,16);
 surface.draw(game.assets['images/map0.png'],8*16,1*16,16,16,0,0,16,16);
 images.signboard=surface;

 // 上り階段
 surface=new Surface(16,16);
 surface.draw(game.assets['images/map0.png'],13*16,0,16,16,0,0,16,16);
 images.upStair=surface;

 // トゲ
 surface=new Surface(16*2,16);
 surface.draw(game.assets['images/map0.png'],0,16,16*2,16,0,0,32,16);
 images.spike=surface;

 // ダミー用
 surface=new Surface(16,16);
 surface.context.clearRect(0,0,16,16);
 images.dummy=surface;


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
   player.image=images.player;
   stair.image=images.upStair;


   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(stair);
   map_scene.availableChara={
    player:player,
    stair:stair
   };

   map_manager.add_map("F1",map_scene);

 })();

 // F2登録
 (function(){
   var backgroundMap = new Map(16, 16);
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
  var dummy=new InvisiblePlayerGate(0,0);
  player.image=images.player;
  mob.image=images.moveBotA;
  spike.image=images.spike;
  stair.image=images.upStair;
  dummy.image=images.dummy;

  var map_scene=new MapScene(player,backgroundMap);

  // プレイヤー以外のオブジェクト追加
  map_scene.addCharacters(mob);
  map_scene.addCharacters(spike);
  map_scene.addCharacters(stair);
  map_scene.addCharacters(dummy);

  map_scene.availableChara={
   player: player,
   mob: mob,
   spike: spike,
   stair: stair,
   dummy: dummy,
  }

  map_manager.add_map("F2",map_scene);
 })();
};
