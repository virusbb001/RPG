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

/*
addCommand('test',{
  initialize: function(owner,properties){
   Command.call(this,owner,properties);
   this.doFlag=false;
  },
  action: function(){
   console.log(this);
   this.doFlag=true;
  },
  popFlag: function(){
   return this.doFlag;
  }
});
*/

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
   this.owner.frame=this.direction*3+this.walk;
   this.owner.direction=this.direction;
  },
  action: function(){
   if(this.preAction&&!this.checkValid()){
    this.isMoving=false;
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
   this.owner.frame=this.direction*3+this.walk;
  },
  // 移動先が壁じゃないかどうかなど
  // 無効な移動は拒否する
  checkValid: function(){
   var characterList=this.owner.parentNode.parentNode.characterList;
   var x=this.owner.x + (this.vx ? this.vx/Math.abs(this.vx)*16: 0) + this.owner.offsetX;
   var y=this.owner.y + (this.vy ? this.vy/Math.abs(this.vy)*16: 0) + this.owner.offsetY;
   var opts={x:x-this.owner.offsetX,y:y-this.owner.offsetY};
   return (0<=x && x< backgroundMap.width && 0<=y && y<backgroundMap.height && !backgroundMap.hitTest(x,y) && characterList.checkHit(this.owner,{},opts).length==0);
  },
  popFlag: function(){
   return !this.isMoving;
  },
  toString: function(){
   return this.cmdName+" direction is "+(["down","left","right","up"])[this.direction];
  }
});

addCommand('wait',{
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
