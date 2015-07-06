enchant('ui');

/**
 * @scope Character.prototype
 */
var Character=enchant.Class.create(enchant.Sprite,{
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
   /**
    * 実際の当たり判定がyからどのくらいY軸方向離れているか
    * @type Integer
    */
   this.offsetY=offsetY;
   /**
    * キャラクターのX座標
    * @type Integer
    */
   this.x=x*16-offsetX;
   /**
    * キャラクターのX座標
    * @type Integer
    */
   this.y=y*16-offsetY;
   /**
    * キャラクターがどの方向を向いているか
    * 上: 3 左 1 右: 2 下: 0
    * @type Number
    */
   this.direction=0;
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
   * スタックが空になれば実行される
   * 任意のタイミングで呼び出しても構わない
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
   * @returns {Boolean} 重なっているか否か
   */
  hitTest: function(target,option){
   option = option || {};
   var x,y;
   var targetX,targetY;
   x=(option.x != null)? option.x : this.x;
   x+=this.offsetX;

   y=(option.y != null)? option.y : this.y;
   y+=this.offsetY;

   targetX=(option.targetX != null)? option.targetX : target.x;
   targetX+=target.offsetX;

   targetY=(option.targetY != null)? option.targetY : target.y;
   targetY+=target.offsetY;

   // <=にしないのは隣通しでも重なっていると判定されるようになってしまうため
   return (x < targetX+16 && targetX < x +16 && y < targetY+16 && targetY < y+16);
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
   * enterframe時にqueueの先頭を見て実行、
   * 実行終了後コマンドのpopflagがtrueであれば先頭から取り除く。
   * もしqueueが空ならthinkingRoutineを実行する
   */
  doAction: function(){
   // キューに1つも積まれていなければthinkを積む
   if(this.queue.length<1){
    this.pushCommand('think',{});
   }
   var act=this.queue[0];
   act.action();
   if(act.popFlag()){
    this.queue.shift();
   }
  },
  mapX: {
   get: function(){
    return (this.x+this.offsetX)/16;
   },
  },
  mapY: {
   get: function(){
    return (this.y+this.offsetY)/16;
   },
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
   * 追加時にも判定され、真であれば追加されない
   * @returns {Boolean} 削除すべきかどうか
   */
  popFlag: function(){
   return true;
  },
  /**
   * 1フレームごとに行う動作
   * ownerのenterframeイベントの時に実行される
   */
  action: function(){
  },
  /**
   * 表示用の名前
   */
  cmdName: null
});

/**
 * @scope CharactersList.prototype
 */
var CharactersList=enchant.Class.create(enchant.Group,{
  /**
   * @name CharactersList
   * @class 色々関数を追加しただけのクラス
   * @extends enchant.Group
   */

  /**
   * childNodesそれぞれと {@link Character#hitTest} を用いて衝突判定を行う。実行方法はchecker.hitTest(childNodes[i],hitTestOptions)
   * @param {Character} checker 衝突判定を行うオブジェクト。自分自身との衝突判定はスキップする。判定は内部のchildNodesの順に行われる。
   * @param {Object} [options={}] checkHitに対するオプション
   * @param {Integer} [options.maxLength=-1] TODO: 何個見つけたら判定を終了するか
   * @param {Object} [hitTestOptions={}]  それぞれのhitTestに渡すオプション
   * @returns {Character []} 衝突していると判定されたキャラクターのリスト
   */
  checkHit: function(checker,options,hitTestOptions){
   var hits=[];
   var nodes=this.childNodes;
   var hitOpt=hitTestOptions || {};
   var opts=options || {};
   // var maxLength=opts.maxLength||-1;
   for(i=0;i<nodes.length /* && (maxLength < 0 || hits.length<=maxLength) */;i++){
    if(nodes[i]===checker){
     continue;
    }
    if(checker.hitTest(nodes[i],hitOpt)){
     hits.push(nodes[i]);
    }
   }
   return hits;
  },
  /**
   * yが小さい順位ソートして見栄えを良くする
   */
  sortY:function(){
   this.childNodes.sort(function(a,b){
    return a.y-b.y;
   });
  }
});

var MapScene=enchant.Class.create(enchant.Scene,{
  initialize:function(player,bgMap,fgMap){
   enchant.Scene.call(this);
   // this.objList=new Group();
   this.characterList=new CharactersList();
   this.bgMap=bgMap;
   this.fgMap=fgMap || null;
   this.player=player;
   this.addChild(this.bgMap);
   this.addChild(this.characterList);
   if(this.fgMap){
    this.addChild(this.fgMap);
   }
   this.addEventListener('enterframe',function(e){
    this.focusToPlayer();
   });
   this.addCharacters(this.player);
  },
  addCharacters: function(character){
   this.characterList.addChild(character);
  },
  focusToPlayer: function(player){
   var x,y;
   var player=this.player;
   if(game.width<this.bgMap.width){
    // 左,上を基準にするか否か
    // (game.width)/2-X<0となるのはプレイヤーがマップを左上に固定したときに画面から右に居るとき
    // Xには中央に合わせたい値を入れる
    // game.width>x+backgroundMap.widthとなるのは
    // プレイヤーの位置が右からgame.width-X以内のとき
    x=Math.min( (game.width )/2 - 16  - player.x, 0);
    x=Math.max(game.width, x+this.bgMap.width) - this.bgMap.width;
   }else{
    x=game.width/2-this.bgMap.width/2;
   }
   if(game.height<this.bgMap.height){
    y=Math.min( (game.height )/2 - 16  - player.y, 0);
    y=Math.may(game.height, y+this.bgMap.height) - this.bgMap.height;
   }else{
    y=game.height/2-this.bgMap.height/2;
   }
   this.bgMap.x=x;
   this.bgMap.y=y;
   this.characterList.x=x;
   this.characterList.y=y;
  }
  /*
  enterframe: function(e){
   // FPS計算
   sumFPS+=game.actualFps;
   if(game.frame%10==0){
    this.lbl.setText(""+Math.round(sumFPS/10));
    sumFPS=0;
   }
   this.characterList.sortY();
  }
  */
});
