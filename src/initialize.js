enchant('ui');

var Characters=enchant.Class.create(enchant.Sprite,{
  initialize: function(x,y,offsetX,offsetY){
   enchant.Sprite.call(this,32,32);
   this.offsetX=offsetX;
   this.offsetY=offsetY;
   this.x=x*16-offsetX;
   this.y=y*16-offsetY;
   this.isMoving=0;
   this.direction=0;
   this.walk=1;
   this.vx=0;
   this.vy=0;
   this.queue=[];
   this.addEventListener('enterframe',this.doAction);
   this.pushCommand('think',{});
  },
  setBaseVelocity: function(v){
   this.baseVelocity=16/Math.floor(16/v);
  },
  // スタックに詰むときに実行される関数
  thinkingRountine: function(){
  },
  /*
   * intersectだと実際の当たり判定での判定が出来ないため
   * x,yからoffsetX,offsetYを足して大きさを計算して当たり判定計算
   */
  hitTest: function(target,option){
   option = option || {};
   var x,y;
   var targetX,targetY;
   x=option.x || this.x;
   y=option.y || this.y;
   targetX=option.targetX || target.x;
   targetY=option.targetY || target.y;
   return (x+this.offsetX < targetX+target.offsetX+16 && targetX+target.offsetX < x+this.offsetX+16 && y+this.offsetY < targetY+ target.offsetY +16 && targetY+target.offsetY  < y+this.offsetY+16);
  },
  // コマンドをpush
  // もし作成時にすでにpopFlagが真であれば追加しない
  pushCommand: function(command,properties){
   var act;
   if(commands[command]){
    act=new commands[command](this,properties);
   }else if(command instanceof Command){
    act=command;
   }
   if(act == undefined){
    return;
   }
   if(act.popFlag()){
    delete act;
   }else{
    this.queue.push(act);
   }
  },
  /*
   * queueの先頭を見て実行
   */
  doAction: function(){
   var act=this.queue[0];
   if(typeof act ==="undefined"){
    return;
   }
   act.action();
   if(act.popFlag()){
    this.queue.shift();
   }
  }
});

var Command=enchant.Class.create({
  initialize:function(owner,properties){
   // 実行者
   this.owner=owner;
   // 実行時のプロパティ
   this.properties=properties;
   this.actioning=false;
  },
  // コマンド削除フラグ
  // 追加時にpopFlagが真であれば削除
  popFlag: function(){
   return true;
  },
  // 1フレームごとに行う動作
  action: function(){
  }
});
