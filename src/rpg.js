var game,player,backgroundMap,mob,commands;
var sumFPS=0;
var entities=new Group();
if(typeof entities.checkHit ==="undefined"){
 entities.checkHit=function(target,options,hitTestOption){
  var hits=[];
  var nodes=this.childNodes;
  var hitOpt=hitTestOption || {};
  var opts=options || {};
  var maxLength=opts.maxLength||-1;
  for(i=0;i<nodes.length /* && (maxLength < 0 || hits.length<=maxLength) */;i++){
   if(nodes[i]===target){
    continue;
   }
   if(target.hitTest(nodes[i],hitOpt)){
    hits.push(nodes[i]);
   }
  }
  return hits;
 };
}
var paused=false;

function toggle_pause(){
 if(paused){
  game.resume()
 }else{
  game.pause();
 }
 paused=!paused;
}

$(function(){
 game=new Game(16*5,16*5);
 lbl=new MutableText(0,0,game.width);
 // lbl.moveTo(10,50);
 game.fps=60;
 game.preload('font0.png','images/chara0.png','images/map1.png');
 game.onload=function(){
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
  entities.addChild(player);

  mob = new Characters(5,2,8,16);
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
  mob.direction=2;
  mob.setBaseVelocity(1);
  mob.preX=undefined;
  mob.thinkingRountine=function(){
   if(this.preX==this.x){
    if(this.direction==2){
     this.direction=1;
    }else{
     this.direction=2;
    }
    this.pushCommand('wait',{count:30});
    // この時に判定する
    this.pushCommand('walk',{direction: this.direction});
   }else{
    this.pushCommand('walk',{direction: this.direction});
   }
   this.preX=this.x;
   this.pushCommand('think',{});
  }
  entities.addChild(mob);

  var stage=new Group();
  stage.addChild(backgroundMap);
  game.rootScene.addChild(stage);
  game.rootScene.addChild(entities);
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
   entities.x=x;
   entities.y=y;
   sumFPS+=game.actualFps;
   if(game.frame%10==0){
    lbl.setText(""+Math.round(sumFPS/10));
    sumFPS=0;
   }
  });
 }
 game.debug();
});

var Player=enchant.Class.create(Characters,{
  initialize: function(x,y,offsetX,offsetY){
   Characters.call(this,x,y,offsetX,offsetY);
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
      this.owner.pushCommand('think',{});
     }
    },
    popFlag:function(){
     return (typeof this.owner.queue[1] !=="undefined");
    }
  })
});

