var game,player,backgroundMap,mob,commands;
var sumFPS=0;
var pause_scene,pause_text;
// キャラクター用配列
var characterList=new CharactersList();
var paused=false;

function toggle_pause(){
 var message_list=
  ([
   "GAME PAUSED",
   "PAME GAUSED",
   "LOL U DIED",
   "DISCONNECTED",
   "ACCESS DENIED",
   "YOU LOSE",
   "GAME OVER",
   "PAUSE AHEAD",
   "TYPE THE COMMAND",
   "$ SHUTDOWN",
   "$ SHITDAMN",
   "TOO COLD",
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
 game.onload=function(){
  /*
  backgroundMap = new Map(16, 16);
  backgroundMap.image = game.assets['images/map1.png'];
  backgroundMap.loadData([
    [7,21,23,23,23,23,23,23,23],
    [7,36,36,36,36,36,36,36,36],
    [7,21,4,4,4,4,4,4,36],
    [7,21,23,23,23,23,23,23,7],
    [7,21,52,52,52,52,52,36,7],
    [7,21,52,52,52,52,52,21,7],
    [23,21,23,23,23,23,23,21,7],
    [36,36,36,36,36,36,36,36,7],
    [7,7,7,7,7,7,7,21,7]
  ]);

  backgroundMap.collisionData = [
   [1,0,1,1,1,1,1,1,1],
   [1,0,0,0,0,0,0,0,0],
   [1,0,0,0,0,0,0,0,0],
   [1,0,1,1,1,1,1,1,1],
   [1,0,0,0,0,0,0,0,1],
   [1,0,0,0,0,0,0,0,1],
   [1,0,1,1,1,1,1,0,1],
   [0,0,0,0,0,0,0,0,1],
   [1,1,1,1,1,1,1,0,1]
  ];
  */

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

  player=new Player(1,1,8,16);
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
  characterList.addChild(player);

  mob = new MoveBot(0,0,8,16);
  mob2= new MoveBot(0,1,8,16);
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
  characterList.addChild(mob);
  characterList.addChild(mob2);

  var stage=new Group();
  stage.addChild(backgroundMap);

  game.rootScene.backgroundColor="#000000";
  // rootSceneに追加
  game.rootScene.addChild(stage);
  game.rootScene.addChild(characterList);
  game.rootScene.addChild(lbl);
  game.rootScene.addEventListener('enterframe',function(e){
   // 左,上を基準にするか否か
   // (game.width)/2-X<0となるのはプレイヤーがマップを左上に固定したときに画面から右に居るとき
   // Xには中央に合わせたい値を入れる
   var x=Math.min( (game.width )/2 - 16  - player.x, 0);
   var y=Math.min( (game.height)/2 - 24 - player.y, 0);
   // game.width>x+backgroundMap.widthとなるのは
   // プレイヤーの位置が右からgame.width-X以内のとき
   x=Math.max(game.width, x+backgroundMap.width) - backgroundMap.width;
   y=Math.max(game.height, y+backgroundMap.height) - backgroundMap.height;
   stage.x=x;
   stage.y=y;
   characterList.x=x;
   characterList.y=y;
   sumFPS+=game.actualFps;
   if(game.frame%10==0){
    lbl.setText(""+Math.round(sumFPS/10));
    sumFPS=0;
   }
   characterList.sortY();
  });

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

var Player=enchant.Class.create(Character,{
  initialize: function(x,y,offsetX,offsetY){
   Character.call(this,x,y,offsetX,offsetY);
   this.baseVelocity=4;
  },
  thinkingRountine:function(){
   this.pushCommand(new this.waitInput(this,{}));
  },
  // 入力待機
  waitInput:enchant.Class.create(Command,{
    action:function(){
     var direction;
     if(game.input.left){
      direction=1;
     }else if(game.input.right){
      direction=2;
     }else if(game.input.up){
      direction=3;
     }else if(game.input.down){
      direction=0;
     }
     if(direction!==undefined){
      this.owner.pushCommand('walk',{direction: direction});
      // 滑らかに動かすために1度actionを実行する
      if(this.owner.queue[1]!==undefined){
       this.owner.queue[1].action();
      }
     }
    },
    popFlag:function(){
     return (typeof this.owner.queue[1] !=="undefined");
    }
  })
});

var MoveBot=enchant.Class.create(Character,{
  initialize: function(x,y,offsetX,offsetY){
   Character.call(this,x,y,offsetX,offsetY);
   this.baseVelocity=1;
   this.direction=2;
   this.moveIndex=3;
   this.preX=undefined;
   this.preY=undefined;
   this.moveArr=[3,1,0,2];
  },
  thinkingRountine: function(){
   if(this.preX==this.x && this.preY==this.y){
    this.moveIndex=(this.moveIndex+1)%this.moveArr.length;
    this.direction=this.moveArr[this.moveIndex];
    this.pushCommand('wait',{count:30});
    this.pushCommand('walk',{direction: this.direction});
   }else{
    this.pushCommand('walk',{direction: this.direction});
   }
   this.preX=this.x;
   this.preY=this.y;
  }
});
