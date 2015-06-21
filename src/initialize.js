enchant('ui');

/**
 * @scope Character.prototype
 */
var Characters=enchant.Class.create(enchant.Sprite,{
  /**
   * @name Character
   * @class キャラクターのオブジェクト
   * @param {Integer} x X座標
   * @param {Integer} y Y座標
   * @param {Integer} offsetX 実際の当たり判定がxからどのくらいX軸方向離れているか
   * @param {Integer} offsetY 実際の当たり判定がyからどのくらいY軸方向離れているか
   * @extends enchant.Sprite
   */
  initialize: function(x,y,offsetX,offsetY){
   enchant.Sprite.call(this,32,32);
   /**
    * 実際の当たり判定がxからどのくらいX軸方向離れているか
    * @type Integer
    */
   this.offsetX=offsetX;
   this.offsetY=offsetY;
   /**
    * 実際の当たり判定がyからどのくらいY軸方向離れているか
    * @type Integer
    */
   this.x=x*16-offsetX;
   /**
    * キャラクターのX座標
    * @type Integer
    */
   this.y=y*16-offsetY;
   /**
    * キャラクターのX座標
    * @type Integer
    */
   this.direction=0;
   /**
    * キャラクターがどの方向を向いているか
    * @type Number
    */
   this.walk=1;
   this.vx=0;
   this.vy=0;
   this.queue=[];
   /**
    * 行動キュー
    * @type Array
    */
   this.addEventListener('enterframe',this.doAction);
   this.pushCommand('think',{});
  },
  /**
   * 速度指定
   * @param {Integer} Velocity 速度
   */
  setBaseVelocity: function(v){
   this.baseVelocity=16/Math.floor(16/v);
  },
  /**
   * スタックに詰むときに実行される関数
   * <del>スタックが空になれば実行される</del>
   * 手動でthinkコマンドを実行して追加しなければならない
   * TODO:任意のタイミングで呼び出しても構わないようにする
   */
  thinkingRountine: function(){
  },
  /**
   * intersectだと実際の当たり判定での判定が出来ないためこの関数で衝突判定を行う
   * x,yからoffsetX,offsetYを足して大きさを計算して当たり判定計算
   * @param {Character} target 衝突判定をする対象
   * @param {Object} [option={}] 衝突判定のオプション
   * @param {Integer} [option.x] 自身のX座標をxとして判定
   * @param {Integer} [option.y] 自身のY座標をyとして判定
   * @param {Integer} [option.targetX] 対象のX座標をtargetXとして判定
   * @param {Integer} [option.targetY] 対象のY座標をtargetYとして判定
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
  /**
   * コマンドをpushする関数
   * 但し、作成時に既にpopFlagが真であれば追加しない
   * @param {String|Command} command commandsに登録されているコマンドかcommandオブジェクト
   * @param {Object} properties commandsに追加するためのプロパティ
   */
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
  /**
   * enterframe
   * queueの先頭を見て実行
   * 実行終了後コマンドのpopflagがtrueであれば先頭から取り除く
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

/**
 * @scope Command.prototype
 */
var Command=enchant.Class.create({
  /**
   * @name Command
   * @class コマンドのオブジェクト
   * @param {Character} owner 実行者
   * @param {Object} properties プロパティ
   */
  initialize:function(owner,properties){
   // 実行者
   this.owner=owner;
   // 実行時のプロパティ
   this.properties=properties;
   this.actioning=false;
  },
  /**
   * コマンド削除フラグ
   * 追加時にpopFlagが真であれば削除
   */
  popFlag: function(){
   return true;
  },
  /**
   * 1フレームごとに行う動作
   * ownerのenterframeイベントの時に実行される
   */
  action: function(){
  }
});
