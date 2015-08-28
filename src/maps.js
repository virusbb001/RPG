
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

 /*
 (function(){
  // map
  // ここにマップを追加
  var backgroundMap = new Map(16, 16);
  backgroundMap.image = game.assets['images/map1.png'];

  // player
  var player=new Player(0,0);
  player.image=images.player;
  // キャラクターを以下に

  // map_scene追加
  var map_scene=new MapScene(player,backgroundMap);
  // 以下プレイヤー以外のキャラクターを追加
  // map_scene.addCharacters(charas);
  map_scene.availableChara={
   player: player,
  };

  // マップ登録
  map_manager.add_map("map_name",map_scene);
 })();
 */

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
 // チートイントロ/スキップ
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
   var toUp=new Stair(7,1,1,2,"tutorial_compete");
   var toDown=new Stair(7,4,1,3,"tutorial_cheat_walk");

   (function(){
     // [x,y,first_wait,on,off]
     var spike_pos=[
      [4,6],
      [4,4,0],
      [3,4,4], // 4つ送れてon 
      [2,4,8],
      [1,3,0,0],
      [1,1,0,0],
      [2,1,4,0],
      // [3,1,8,0],
      [4,1,16,0]]; // なぜかこれで2フレームズレる
     spike_pos.forEach(function(pos){
      var x=pos[0];
      var y=pos[1];
      var on=pos[3];
      var off=pos[4];
      var spike=new Spike(x,y,(on===undefined)? 6 : on ,(off===undefined)? 6 : off);
      if(pos[2]){
       spike.pushCommand("wait",{count: pos[2]});
      }
      spike.image=images.spike;
      spikes.push(spike);
     });
   })();

   player.image=images.player;
   signboard.image=images.signboard;
   toUp.image=images.upStair;
   toDown.image=images.downStair;

   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(signboard);
   map_scene.addCharacters(toUp);
   map_scene.addCharacters(toDown);
   spikes.forEach(function(spike){
    map_scene.addCharacters(spike);
   });
   map_scene.availableChara={
    player: player,
    spikes: spikes,
    toUp: toUp,
    toDown: toDown
   };

   map_manager.add_map("tutorial_cheat_intro",map_scene);
 })();

 // チュートリアル
 // 歩かせる
 (function(){
   var backgroundMap = new Map(16, 16);
   backgroundMap.image = game.assets['images/map1.png'];

   backgroundMap.loadData([
     [7,7,7,64,23,23,23,7],
     [7,23,7,64,64,64,64,7],
     [7,64,23,64,23,7,64,7],
     [7,64,64,64,64,7,64,7],
     [7,23,23,23,23,23,64,7],
     [7,64,64,64,64,64,64,7],
     [7,7,7,7,7,7,7,7]
    ],[
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1,-1],
     [-1,-1,-1,-1,-1,-1,-1,-1]
   ]);
   backgroundMap.collisionData = [
    [1,1,1,0,1,1,1,1],
    [1,1,1,0,0,0,0,1],
    [1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
   ];

   var player=new Player(1,3);
   var signboard=new Signboard(1,2,[
     "チュートリアルステージへ\nようこそ!",
     "ここでは，ゲームの外から\nゲームへの干渉を行う\n方法を教えます．",
     "試しに，左上の'esc'と\n書かれたキーを押した後，\n\"exit\"と入力し，\n次に右にある'enter'と\n書かれたキーを押した後，\nZキーを押して進めてください．",
     "escキーを押した時に\n出てきたものが\nゲームの外からゲームへ\n操作を行うものです．",
     "これはコマンドの入力によって\nあなたの操作する\nプレイヤーキャラクター\n(以降PC)に\n指示を出すものです．",
     "もしメッセージを\n読んでいる時に\n操作を指示した場合，\nメッセージを読み終えてから\n指示が実行されます",
     "手始めに，PCをカーソルキーを\n*使わずに* 移動させて\nみましょう",
     "escキーを押し，\n\"walk right\"と入力して\nPCを右に移動するように\n指示します\n最後にenterキーを押して\nexitと入力して\nenterキーを押すのを\n忘れないで下さい！\nこれを看板にぶつかるまで\n繰り返してください\n看板にぶつかったら，\nその看板をXキーで調べてください．"
   ]);

   var walk_manytime=new Signboard(4,3,[
     "素晴らしい!\nあなたはカーソルキーを\n使わずにPCを右に1マス\n動かすことに成功しました!\nもしカーソルキーを\n使って移動した場合\n左の看板まで戻って\nやり直すことを\nおすすめします",
     "walkコマンドは回数を指定して\n移動させることも出来ます\n",
     "walk up 2\nで上(up)に2回移動させるように\n指示することが出来ます\n最後にenterキーを\n押してexitすることを\n忘れないように\n気をつけましょう\n"
   ]);

   var continuous_instruction=new Signboard(3,0,[
     "おめでとうございます！\nあなたは回数を指定して\nPCを歩かせること\nに成功しました\n",
     "では，このまま右・下・左\nと続けて動かしてみましょう\n",
     "walk left\nwalk down\nとすると\n左に1マス\n下に1マス\n歩かせることが出来ます",
     "upで上，downで下\nleftで左，rightで右\nに移動できます\nこれまでのことを\n組み合わせて階段まで\n歩かせてみましょう！\n最後にexitするのを\nお忘れなく"
   ]);
   var stair=new Stair(1,5,1,2,"tutorial_watch");

   player.image=images.player;
   signboard.image=images.signboard;
   walk_manytime.image=images.signboard;
   stair.image=images.upStair;
   continuous_instruction.image=images.signboard;

   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(signboard);
   map_scene.addCharacters(walk_manytime);
   map_scene.addCharacters(continuous_instruction);
   map_scene.addCharacters(stair);
   map_scene.availableChara={
    player: player,
   };

   map_manager.add_map("tutorial_cheat_walk",map_scene);
 })();

 // チュートリアル watch
 (function(){
  // map
  // ここにマップを追加
  var backgroundMap = new Map(16, 16);
  backgroundMap.image = game.assets['images/map1.png'];
  backgroundMap.loadData([
    [7,23,7,7,7,7,7],
    [7,64,23,23,23,23,7],
    [7,64,64,64,64,64,7],
    [7,7,7,23,23,64,7],
    [7,7,7,64,64,64,7],
    [7,23,23,64,7,64,7],
    [7,64,64,64,7,7,7],
    [7,7,7,7,7,7,7]
   ],[
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1]
  ]);
  backgroundMap.collisionData = [
    [1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1],
    [1,1,1,0,0,0,1],
    [1,1,1,0,1,0,1],
    [1,0,0,0,1,1,1],
    [1,1,1,1,1,1,1]
   ];

  // player
  var player=new Player(1,2);
  player.image=images.player;
  // キャラクターを以下に
  var stair=new Stair(1,6,1,7,"tutorial_spike_hell_again");
  stair.image=images.upStair;
  var spikes=[];
  spikes[0]=new Spike(3,2,6,6);
  spikes[1]=new Spike(3,5,0,6);
  spikes[2]=new Spike(3,6,0,6);
  spikes[2].pushCommand("wait",{count: 4});
  spikes.forEach(function(spike){
   spike.image=images.spike;
  });
  var watch_intro=new Signboard(1,1,[
    "あなたはゲーム外から\n歩く方法を学びました",
    "しかし，このままでは\nカーソルキーを使うほうが\n楽でしょう",
    "そこで，walkコマンドと\n組み合わせて使う\nwatchコマンド\nについてお教えします",
    "watchコマンドは，\nPCが向いている方向に\nトゲがあった場合，\nトゲが *出てから* *引っ込んだ* \n 瞬間になるまで\nその場で待機するコマンドです",
    "watchコマンドの後に\nwalkコマンドを入力することで\n安全に通り抜けられます",
    "試しに，すぐ右にある\nトゲの横で\nwatch\nwalk right 2\nと指示してみましょう\nダメージ無く\n通り抜けられるはずです"
  ]);
  watch_intro.image=images.signboard;
  var turn_and_run=new Signboard(5,5,[
    "この看板が最後の\nチュートリアルです",
    "左のようにトゲが\n並んでいるものは\n待っている余裕はないので\nそのまま通ってしまいましょう",
    "とはいえ，\n上の方のトゲを\nwatchするために\nトゲの方向を向こうとすると\n移動してトゲの上に\n乗ってしまってダメージを\n受けてしまいます",
    "そこで，移動せずにその場で\n方向転換する方法を\nお教えします",
    "Shiftキーを押しながら\nカーソルキーを押してください\nこれで移動せずに\n方向だけを変えることが\n出来ます",
    "また，turnコマンド\nでも方向を変えることが\nできます",
    "頑張って通り抜けて\nください！"
  ]);
  turn_and_run.image=images.signboard;

  // map_scene追加
  var map_scene=new MapScene(player,backgroundMap);
  // 以下プレイヤー以外のキャラクターを追加
  // map_scene.addCharacters(charas);
  map_scene.addCharacters(stair);
  map_scene.addCharacters(watch_intro);
  map_scene.addCharacters(turn_and_run);
  spikes.forEach(function(spike){
   map_scene.addCharacters(spike);
  });
  map_scene.availableChara={
   player: player,
   spikes: spikes,
  };

  // マップ登録
  map_manager.add_map("tutorial_watch",map_scene);
 })();

 // spike hell again
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
     "これが最後です",
     "頑張って奥の階段\nまで行きましょう！",
     "右の階段に行くと\nチュートリアルをやり直せます"
   ]);
   var spikes=new Array();
   var toUp=new Stair(7,1,1,2,"tutorial_compete");
   var toDown=new Stair(7,4,1,3,"tutorial_cheat_walk"); // again

   (function(){
     // [x,y,first_wait,on,off]
     var spike_pos=[
      [4,6],
      [4,4,0],
      [3,4,4], // 4つ送れてon 
      [2,4,8],
      [1,3,0,0],
      [1,1,0,0],
      [2,1,4,0],
      // [3,1,8,0],
      [4,1,16,0]]; // なぜかこれで2フレームズレる
     spike_pos.forEach(function(pos){
      var x=pos[0];
      var y=pos[1];
      var on=pos[3];
      var off=pos[4];
      var spike=new Spike(x,y,(on===undefined)? 6 : on ,(off===undefined)? 6 : off);
      if(pos[2]){
       spike.pushCommand("wait",{count: pos[2]});
      }
      spike.image=images.spike;
      spikes.push(spike);
     });
   })();

   player.image=images.player;
   signboard.image=images.signboard;
   toUp.image=images.upStair;
   toDown.image=images.downStair;

   var map_scene=new MapScene(player,backgroundMap);
   map_scene.addCharacters(signboard);
   map_scene.addCharacters(toUp);
   map_scene.addCharacters(toDown);
   spikes.forEach(function(spike){
    map_scene.addCharacters(spike);
   });
   map_scene.availableChara={
    player: player,
    spikes: spikes,
    toUp: toUp,
    toDown: toDown
   };

   map_manager.add_map("tutorial_spike_hell_again",map_scene);
 })();

 // tutorial compete
 (function(){
  // map
  // ここにマップを追加
  var backgroundMap = new Map(16, 16);
  backgroundMap.image = game.assets['images/map1.png'];
  backgroundMap.loadData([
    [7,23,7,7,7,7,7],
    [7,64,23,23,23,23,7],
    [7,64,64,64,64,64,7],
    [7,7,7,7,7,7,7],
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
    [1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1]
   ];

  // player
  var player=new Player(0,0);
  player.image=images.player;
  // キャラクターを以下に
  var signboard=new Signboard(1,1,[
    "チュートリアルお疲れ様でした",
    "本番ですが，\n次にあるのは迷路です",
    "しかし，至る所の\n角にトゲが有ります\nかわして\n右下のゴールまで\n向かってください",
    "頑張ってください!",
  ]);
  signboard.image=images.signboard;
  var stair=new Stair(5,2,1,1,"maze");
  stair.image=images.upStair;

  // map_scene追加
  var map_scene=new MapScene(player,backgroundMap);
  // 以下プレイヤー以外のキャラクターを追加
  // map_scene.addCharacters(charas);
  map_scene.addCharacters(signboard);
  map_scene.addCharacters(stair);
  map_scene.availableChara={
   player: player,
  };

  // マップ登録
  map_manager.add_map("tutorial_compete",map_scene);
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
  };

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
   // TODO:トゲ指定
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
      var spike=new Spike(x,y,0,6);
      var count=Math.floor(Math.random()*5);
      spike.image=images.spike;
      if(count){
       spike.pushCommand("wait",{count: count});
      }
      spikes.push(spike);
     }
    }
   }
   var stair=new Stair(19,19,2,2,"game_clear");
   stair.image=images.upStair;

   var map_scene=new MapScene(player,map);
   map_scene.addCharacters(stair);

   spikes.forEach(function(spike){
    map_scene.addCharacters(spike);
   });

   map_scene.availableChara={
    player: player,
    spikes: spikes
   };

   map_manager.add_map("maze",map_scene);
 })();

 (function(){
  // map
  // ここにマップを追加
  var backgroundMap = new Map(16, 16);
  backgroundMap.image = game.assets['images/map1.png'];
  backgroundMap.loadData([
    [7,23,23,23,7],
    [7,64,64,64,7],
    [7,64,64,64,7],
    [7,64,64,64,7],
    [7,7,7,7,7]
   ],[
    [-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1]
  ]);
  backgroundMap.collisionData = [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1]
   ];

  // player
  var player=new Player(0,0);
  player.image=images.player;
  // キャラクターを以下に
  var signboard=new Signboard(2,1,[
    "ゲームクリア\nおめでとうございます!",
    "このゲームはまだ\n未完成です\nもし気に入ったら\n感想をお願いいたします!\n感想は下の\"感想\"と\nかかれたところを\nクリックして感想を\n書き込んでください"
  ]);
  signboard.image=images.signboard;

  // map_scene追加
  var map_scene=new MapScene(player,backgroundMap);
  // 以下プレイヤー以外のキャラクターを追加
  // map_scene.addCharacters(charas);
  map_scene.addCharacters(signboard);
  map_scene.availableChara={
   player: player,
  };

  // マップ登録
  map_manager.add_map("game_clear",map_scene);
 })();
};
