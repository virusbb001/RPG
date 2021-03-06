// ゲーム用コマンド

commands={};
function addCommand(name,definition){
 if(commands[name]){
  throw new Error('commands['+name+'] is already exist.');
 }
 definition.cmdName=name;
 commands[name]=enchant.Class.create(Command,definition);
 return commands[name];
}

// 指定の方向に歩くコマンド
// direction: 数値
// 0: Down 1: Left 2: Right 3: Up
addCommand('walk',{
  /*
   * 0: Down 1: Left 2: Right 3: Up
   */
  initialize: function(owner,properties){
   Command.call(this,owner,properties);
   this.preAction=true;
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
    throw new Error("Invalid value: properties.direction");
   }
   // TODO: なんとかする
   // this.owner.frame=this.direction*3+this.walk;
  },
  action: function(){
   // 行動前
   if(this.preAction){
    this.owner.direction=this.direction;
    this.owner.state_frame=this.walk;
    if(!this.checkValid()){
     this.isMoving=false;
    }
   }
   this.preAction=false;
   if(!this.isMoving){
    return;
   }
   this.owner.moveBy(this.vx,this.vy);
   if( game.frame%3 == 0){
    this.walk++;
    this.walk%=3;
   }
   if( (this.vx&&(this.owner.x - this.owner.offsetX)%16 == 0)||(this.vy && (this.owner.y-this.owner.offsetY) % 16 == 0)){
    this.isMoving=false;
    this.walk=1;
   }
   this.owner.state_frame=this.walk;
  },
  // 移動先が壁じゃないかどうかなど
  // 無効な移動は拒否する
  checkValid: function(){
   var map_scene=this.owner.parentNode.parentNode;
   var characterList=map_scene.characterList;
   var map=map_scene.bgMap;
   var x=this.owner.x + (this.vx ? this.vx/Math.abs(this.vx)*16: 0) + this.owner.offsetX;
   var y=this.owner.y + (this.vy ? this.vy/Math.abs(this.vy)*16: 0) + this.owner.offsetY;
   var opts={x:x-this.owner.offsetX,y:y-this.owner.offsetY};
   return (0<=x && x< map.width && 0<=y && y<map.height && !map.hitTest(x,y) && characterList.checkHit(this.owner,{maxLength:1},opts).length==0);
  },
  popFlag: function(){
   return !this.isMoving;
  },
  toString: function(){
   return this.cmdName+" direction is "+(["down","left","right","up"])[this.direction];
  }
});

// 向きを変えるコマンド
// direction: 数値
// 0: Down 1: Left 2: Right 3: Up
addCommand('turn',{
  /*
   * 0: Down 1: Left 2: Right 3: Up
   */
  initialize: function(owner,properties){
   Command.call(this,owner,properties);
   if( !(properties!=undefined && properties.direction!=undefined)){
    throw(new Error("missing property: direction"));
   }
   this.direction=properties.direction;
  },
  action: function(){
   this.owner.direction=this.direction;
   this.owner.state_frame=1;
  },
  popFlag: function(){
   return true;
  },
  toString: function(){
   return this.cmdName+" direction is "+(["down","left","right","up"])[this.direction];
  }
});

// その場で待機するコマンド
// count: 待つフレーム数
addCommand('wait',{
  initialize:function(owner,properties){
   Command.call(this,owner,properties);
   this.count=this.properties.count || 0;
  },
  action:function(){
   this.count--;
  },
  popFlag:function(){
   return !(this.count>0);
  },
  toString: function(){
   return this.cmdName+" "+this.count;
  }
});

// thinkingRoutineを呼び出すコマンド
addCommand('think',{
  initialize:function(owner,properties){
   Command.call(this,owner,properties);
   this.executed=false;
  },
  action:function(){
   this.owner.thinkingRoutine();
   this.executed=true;
  },
  popFlag:function(){
   return this.executed;
  }
});

addCommand('watch',{
  initialize: function(owner,properties){
   Command.call(this,owner,properties);
   this.flag=false;
   this.spike=undefined;
  },
  action: function(){
   // var res=this.owner.parentNode.checkHit(this.owner);
   if(!this.spike){
    var dir=this.owner.direction;
    var x=0;
    var y=0;
    switch(dir){
    case 0:
     y=1;
     break;
    case 1:
     x=-1;
     break;
    case 2:
     x=1;
     break;
    case 3:
     y=-1;
     break;
    }
    var dummy=new Character(0,0,0,0,16,16);
    dummy.move_map(this.owner.mapX+x,this.owner.mapY+y);
    var res=this.owner.parentNode.checkHit(dummy,{},{ignoreCollision: true});
    var target=res[0];
    if(target instanceof Spike){
     this.spike=target;
    }else{
     console.log(target);
     this.flag=true;
    }
   }
   if(this.spike && this.spike.queue[0] instanceof this.spike.toggle_on_off && this.spike.state){
    this.flag=true;
   }
  },
  popFlag:function(){
   return this.flag;
  }
});

// Knight用コマンド
// 今のところ剣を振るモーションを行うのみ
addCommand('attack',{
  initialize: function(owner,properties){
   Command.call(this,owner,properties);
   if(owner instanceof Knight){
    this.change_state=true;
   }
   this.state_interval=30;
   this.count=0;
   this.endFlag=false;
  },
  action: function(){
   if(this.change_state){
    this.owner.state=2;
    this.change_state=false;
   }
   this.owner.state_frame=Math.floor(this.count/this.state_interval);
   this.count++;
   if(this.count==this.state_interval*3){
    this.owner.state=0;
    this.owner.state_frame=1;
    this.endFlag=true;
   }
  },
  popFlag: function(){
   return this.endFlag;
  }
});

// 今のところプレイヤー用コマンド
// 向いている方向のCharacterを調べる
// 即ち、向いている方向のCharacterにcheckイベントを発火
addCommand('check',{
  action:function(){
   // var res=this.owner.parentNode.checkHit(this.owner);
   var dir=this.owner.direction;
   var x=0;
   var y=0;
   switch(dir){
   case 0:
    y=1;
    break;
   case 1:
    x=-1;
    break;
   case 2:
    x=1;
    break;
   case 3:
    y=-1;
    break;
   }
   var dummy=new Character(0,0,0,0,16,16);
   dummy.move_map(this.owner.mapX+x,this.owner.mapY+y);
   var res=this.owner.parentNode.checkHit(dummy);
   if(res.length>0){
    var e=new enchant.Event("check");
    e.checker=this.owner;
    res.forEach(function(val){
     val.dispatchEvent(e);
    });
   }
  }
});

// 危ない
addCommand('func',{
  initialize:function(owner,properties){
   Command.call(this,owner,properties);
   if(typeof properties.popFlag ==="undefined"){
    throw new Error("popFlag is undefined");
   }else if(!(properties.popFlag instanceof Function)){
    throw new Error("popFlag is Not Function");
   }
   if(properties.initialize instanceof Function){
    properties.initialize.call(this);
   }
  },
  action:function(){
   if(this.properties.action instanceof Function){
    this.properties.action.call(this);
   }
  },
  popFlag:function(){
   return this.properties.popFlag();
  }
});
