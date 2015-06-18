var game,player,backgroundMap,mob,commands;
var sumFPS=0;

commands={};

$(function(){
 game=new Game(16*9,16*9);
 lbl=new Label();
 lbl.moveTo(10,50);
 game.fps=60;
 game.preload('images/chara0.png','images/map1.png');
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
  //画像枠
  for(i=0;i<96/32;i++){
   image.context.beginPath();
   image.context.moveTo(i*32,0);
   image.context.lineTo(i*32,128);
   image.context.stroke();
  }
  for(i=0;i<128/32;i++){
   image.context.beginPath();
   image.context.moveTo(0,i*32);
   image.context.lineTo(96,i*32);
   image.context.stroke();
  }
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

  mob = new Characters(5,2,8,16);
  mobImage=new Surface(96,128);
  for(i=0;i<96/32;i++){
   mobImage.context.beginPath();
   mobImage.context.moveTo(i*32,0);
   mobImage.context.lineTo(i*32,128);
   mobImage.context.stroke();
  }
  for(i=0;i<128/32;i++){
   mobImage.context.beginPath();
   mobImage.context.moveTo(0,i*32);
   mobImage.context.lineTo(96,i*32);
   mobImage.context.stroke();
  }
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
  mob.vx=1;
  mob.direction=2;
  mob.vy=0;
  mob.setBaseVelocity(1);
  //mob.addEventListener('enterframe',mob.frameFunc);

  var stage=new Group();
  stage.addChild(backgroundMap);
  stage.addChild(player);
  stage.addChild(mob);
  game.rootScene.addChild(stage);
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
   sumFPS+=game.actualFps;
   if(game.frame%10==0){
    lbl.text=Math.round(sumFPS/10);
    sumFPS=0;
   }
  });
 }
 game.start();
});


commands['walk']=enchant.Class.create(Command,{
  /*
   * 0: Down 1: Left 2: Right 3: Up
   */
  initialize: function(owner,properties){
   Command.call(this,owner,properties);
   this.walk=1;
   if( !(properties!=undefined && properties.direction!=undefined)){
    throw(new Error("missing property: direction"));
   }
   this.direction=properties.direction;
   this.isMoving=true;
   // 方向から速度指定
   this.vx=0;
   this.vy=0;
   switch (properties.direction) {
   case 1:
    this.vx=-this.owner.baseVelocity;
    break;
   case 2:
    this.vx=this.owner.baseVelocity;
    break;
   case 3:
    this.vy=-this.owner.baseVelocity;
    break;
   case 0:
    this.vy=this.owner.baseVelocity;
    break;
   default:
    throw new Error("Invalid value: properties");
   }
   this.owner.frame=this.direction*3+this.walk;
   this.owner.direction=this.direction;
   if(!this.checkValid()){
    this.isMoving=false;
   }
  },
  action: function(){
   if(!this.isMoving){
    return;
   }
   this.owner.frame=this.direction*3+this.walk;
   this.owner.moveBy(this.vx,this.vy);
   if( game.frame%3 == 0){
    this.walk++;
    this.walk%=3;
   }
   if( (this.vx&&(this.owner.x - this.owner.offsetX)%16 == 0)||(this.vy && (this.owner.y-this.owner.offsetY) % 16 == 0)){
    this.isMoving=false;
    this.walk=1;
   }
  },
  // 移動先が壁じゃないかどうかなど
  // 無効な移動は拒否する
  checkValid: function(){
   var x=this.owner.x + (this.vx ? this.vx/Math.abs(this.vx)*16: 0) + this.owner.offsetX;
   var y=this.owner.y + (this.vy ? this.vy/Math.abs(this.vy)*16: 0) + this.owner.offsetY;
   return (0<=x && x< backgroundMap.width && 0<=y && y<backgroundMap.height && !backgroundMap.hitTest(x,y) /*&&hitentities*/ );
  },
  popFlag: function(){
   return !this.isMoving;
  }
});

commands['wait']=enchant.Class.create(Command,{
  /*
   * その場で待機
   */
  initialize:function(owner,properties){
   Command.call(this,owner,properties);
   this.count=this.properties.count || 0;
  },
  action:function(){
   this.count--;
  },
  popFlag:function(){
   return this.count==0;
  }
});

commands['think']=enchant.Class.create(Command,{
  initialize:function(owner,properties){
   Command.call(this,owner,properties);
   this.executed=false;
  },
  action:function(){
   this.owner.thinkingRountine();
   this.executed=true;
  },
  popFlag:function(){
   return this.executed;
  }
});

var Player=enchant.Class.create(Characters,{
  initialize: function(x,y,offsetX,offsetY){
   Characters.call(this,x,y,offsetX,offsetY);
   this.baseVelocity=4;
   this.pushCommand('think',{});
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

