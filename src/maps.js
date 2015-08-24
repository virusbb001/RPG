
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

 // 下り階段
 surface=new Surface(16,16);
 surface.draw(game.assets['images/map0.png'],14*16,0,16,16,0,0,16,16);
 images.downStair=surface;

 // トゲ
 surface=new Surface(16*2,16);
 surface.draw(game.assets['images/map0.png'],0,16,16*2,16,0,0,32,16);
 images.spike=surface;

 // ダミー用
 surface=new Surface(16,16);
 surface.context.clearRect(0,0,16,16);
 images.dummy=surface;

 surface=new Surface(16,16);
 surface.draw(game.assets['images/map0.png'],16*2,16,16,16,0,0,16,16);
 images.flower=surface;


 // 最初のマップ
 // チュートリアル: 看板・階段・調べる
 (function(){
   var backgroundMap = new Map(16, 16);
   backgroundMap.image = game.assets['images/map1.png'];
   backgroundMap.loadData([
     [7,23,23,7,7,7],
     [7,64,64,23,23,7],
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
    [1,0,0,1,1,1],
    [1,0,0,0,0,1],
    [1,1,1,1,1,1]
   ];
   var player=new Player(1,1);
   /*
    player.pushCommand(new player.waitMessage(player,{
    messages: [
    "[Zキーを押して次に進む]",
    "簡単なゲーム説明を行います",
    "カーソルキー(←↓↑→)で\n上下左右に移動します",
    "Xキーで向いている方向の\nキャラクターや物を\n調べることが出来ます",
    "ためしに，右にある看板を調べてみましょう\n"
   ],
 }));
 */
   var stair=new Stair(4,2,1,3,"tutorial2");
   var signboard=new Signboard(2,1,[
     "[Zキーを押して次に進む]",
     "デモ版\"RPG\"にようこそ",
     "カーソルキー(←↓↑→)で\n上下左右に移動します",
     "Xキーで向いている方向の\nキャラクターや物を\n調べることが出来ます",
     "ためしに，\n右にある看板を\n調べてみましょう",

     "おめでとう!\n看板を調べることに\n成功しました!",
     "このゲームでは\n塔の頂上を目指すことです",
     "マップのどこかにある\n階段に乗ると、\n上に行くことが出来ます",
     "様々な操作方法は，\n看板を通じて教えます\n初めての場合は\n必ずチェックしましょう"]
   );
   player.image=images.player;
   stair.image=images.upStair;
   signboard.image=images.signboard;

   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(stair);
   map_scene.addCharacters(signboard);
   map_scene.availableChara={
    player:player,
    stair:stair,
    signboard: signboard
   };

   map_manager.add_map("F1",map_scene);

 })();

 // チュートリアル
 // トゲ
 (function(){
   var backgroundMap = new Map(16, 16);
   backgroundMap.image = game.assets['images/map1.png'];
   backgroundMap.loadData([
     [7,7,7,23,23,23,7],
     [7,23,7,64,64,64,7],
     [7,64,23,64,7,7,7],
     [7,64,64,64,7,7,7],
     [7,7,7,7,7,7,7]
    ],[
     [-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1]
   ]);
   backgroundMap.collisionData = [
    [1,1,1,1,1,1,1],
    [1,1,1,0,0,0,1],
    [1,0,1,0,1,1,1],
    [1,0,0,0,1,1,1],
    [1,1,1,1,0,1,1]
   ];
   var player=new Player(0,0);
   var signboard=new Signboard(1,2,[
     "まずはじめに，\nこのゲームが\n未完成であることを\nお詫びします",
     "例えば，\nこのゲームに\nアイテムや回復\nといったものが\nありません",
     "これは，体力が\n減ったらそのまま\n戻らないことを意味します\n",
     "また，体力が0になった場合\nゲームオーバとなり\n操作できなくなります\n",
     "ゲームオーバになった場合，\n⌘が書かれたキーを押しながら\nRキーを押して\nやり直してください"]
   );
   var spike=new Spike(3,2,2,60*3-2);
   var stair=new Stair(5,1,1,7,"tutorial_cheat_intro");

   player.image=images.player;
   signboard.image=images.signboard;
   spike.image=images.spike;
   stair.image=images.upStair;

   var map_scene=new MapScene(player,backgroundMap);

   map_scene.addCharacters(signboard);
   map_scene.addCharacters(spike);
   map_scene.addCharacters(stair);
   map_scene.availableChara={
    player: player,
    spike: spike,
    stair: stair
   };

   map_manager.add_map("tutorial2",map_scene);
 })();

 // チュートリアル
 (function(){
   var backgroundMap = new Map(16, 16);
   backgroundMap.image = game.assets['images/map1.png'];
   backgroundMap.loadData([
     [7,23,23,23,23,23,23,23,7],
     [7,64,64,64,64,64,64,64,7],
     [7,64,7,7,7,7,7,7,7],
     [7,64,23,23,23,7,7,23,7],
     [7,64,64,64,64,7,7,64,7],
     [7,23,7,7,64,7,7,64,7],
     [7,64,23,23,64,23,23,64,7],
     [7,64,64,64,64,64,64,64,7],
     [7,7,7,7,7,7,7,7,7]
   ]);
   backgroundMap.collisionData = [
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,0,1],
    [1,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1]
   ];

   var player=new Player(0,0);
   var signboard=new Signboard(1,6,[
     "おっと，まだトゲの説明を\n指定ませんでしたね",
     "トゲは，もしあなたの体が\nトゲに少しでも乗っていたら，\n1フレームにあたり\nあなたの体力(HP)を\n1減らします",
     "フレームとは，\nこの世界が進む単位のことで，\n全てのキャラクターは\n1フレームごとに\n状態が変わります\n例えば，キャラクターは\n1フレームに1/4マス進みます",
     "さて，\n上の階段に行く道は難しく，\nこのままでは\nクリアできないかもしれません",
     "しかし，もしあなたが\n上の階段に行くことが出来れば\n今後全てのチュートリアルを\n飛ばして本編に\n行くことが出来ます",
     "もし自力で行くことが\n難しければ，右の階段に\nお進みください"
   ]);
   var spikes=new Array();
   var toUp=new Stair(7,1,1,1,"F1"); // TODO: "move to Do you know?"
   var toDown=new Stair(7,4,1,1,"F3"); // TODO: you dirty cheater

   // TODO: トゲ設定

   player.image=images.player;
   signboard.image=images.signboard;
   toUp.image=images.upStair;
   toDown.image=images.downStair;

   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(signboard);
   map_scene.addCharacters(toUp);
   map_scene.addCharacters(toDown);
   map_scene.availableChara={
    player: player,
    spikes: spikes,
    toUp: toUp,
    toDown: toDown
   };

   map_manager.add_map("tutorial_cheat_intro",map_scene);
 })();

 // F3登録
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

  map_manager.add_map("F3",map_scene);
 })();

 // 迷路
 (function(){
   var map=RPG_Util.convertMaze2Map(RPG_Util.generateMaze(21,21));
   map.image=game.assets['images/map1.png'];
   var player=new Player(1,1);
   player.image=images.player;
   var spikes=new Array();
   var maze=map.collisionData;
   var width=maze.length;
   var height=maze[0].length;
   for(var i=0;i<Math.floor((maze.length)/2);i++){
    for(var j=0;j<Math.floor((maze[i].length)/2);j++){
     var x=j*2+1;
     var y=i*2+1;
     if((x-1)<0 || (y-1)<0 || width<=(x+1) || height<=(y+1)){
      continue;
     }

     // 初期位置かゴールなら無視
     if((x==1 && y==1) || (x==19 && y==19)){
      continue;
     }
     var corner=(!maze[y][x-1] || !maze[y][x+1]) && (!maze[y-1][x] || !maze[y+1][x]);
     if(corner && Math.floor(Math.random()*3)<1){
      // 角のところに1/3の確率で追加
      var spike=new DebugMapChip(x,y);
      spike.image=images.flower;
      spikes.push(spike);
     }
    }
   }

   var map_scene=new MapScene(player,map);

   spikes.forEach(function(spike){
    map_scene.addCharacters(spike);
   });

   map_scene.availableChara={
    player: player,
    spikes: spikes
   };

   map_manager.add_map("maze",map_scene);

 })();
};
