enchant('ui');
var commands;

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
  cmdName: null,
  toString: function(){
   var str=this.cmdName;
   return str;
  }
});

/**
 * @scope Character.prototype
 */
var Character=enchant.Class.create(enchant.Sprite,{
  /**
   * @name Character
   * @class キャラクターのオブジェクト
   * @param {Integer} x マップX座標
   * @param {Integer} y マップY座標
   * @param {Integer} offsetX 実際の当たり判定がxからどのくらいX軸方向離れているか
   * @param {Integer} offsetY 実際の当たり判定がyからどのくらいY軸方向離れているか
   * @param {Integer} width 実際の当たり判定がyからどのくらいY軸方向離れているか
   * @param {Integer} height 実際の当たり判定がyからどのくらいY軸方向離れているか
   * @extends enchant.Sprite
   */
  initialize: function(x,y,offsetX,offsetY,width,height){
   var width=width;
   var height=height;
   enchant.Sprite.call(this,width,height);
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
    * キャラクターの表示X座標
    * @type Integer
    */
   this.x=x*16-offsetX;
   /**
    * キャラクターの表示Y座標
    * @type Integer
    */
   this.y=y*16-offsetY;
   this.walk=1;
   this.vx=0;
   this.vy=0;
   /**
    * 行動キュー
    * @type Array
    */
   this.queue=[];
   this.pushCommand('think',{});
   this.frame=0;
  },
  /**
   * 基本速度指定
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
  thinkingRoutine: function(){
  },
  /**
   * intersectだと実際の当たり判定での判定が出来ないためこの関数で衝突判定を行う
   * x,yからoffsetX,offsetYを足して大きさを計算して当たり判定計算
   * this.hitTest(target)&&target.hitTest(this)がtrueであれば衝突判定を行う
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
   return (this.isCollision(targetX)&&target.isCollision(this))&&(x < targetX+16 && targetX < x +16 && y < targetY+16 && targetY < y+16);
  },
  /**
   * mapX,mapYのみの比較のみで当たり判定を行う関数
   * mapX,mapYを取得し両方共同値であればtrue
   * @param {Character} target 衝突判定をする対象
   * @param {Object} [option={}] 衝突判定のオプション
   * @returns {Boolean} 重なっているか否か
   */
  compareMapPos: function(target,option){
   var option=option||{};
   return this.mapX==target.mapX&&this.mapY==target.mapY;
  },
  /**
   * コマンドをpushする関数
   * @param {String|Command} command commandsに登録されているコマンドかcommandオブジェクト
   * @param {Object} properties commandsに追加するためのプロパティ commandがオブジェクトの場合は不要
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
   this.queue.push(act);
  },
  /**
   * enterframe時にqueueの先頭を見て実行、
   * 実行終了後コマンドのpopflagがtrueであれば先頭から取り除く。
   * もしqueueが空ならthinkingRoutineを実行する
   * この時popFlagを見ずに実行するため、actionの時点で問題ないかを確認する必要が有る
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
  /**
   * 対象に対して衝突判定をするか
   * @param {Character} target 対象
   * @returns {Boolean} 衝突判定をするかどうか
   */
  isCollision: function(target){
   return true;
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
  },
  /**
   * マップ座標X,Yに移動する
   * @param {Integer} map_x マップX座標
   * @param {Integer} map_y マップY座標
   */
  move_map: function(map_x,map_y){
   this.x=map_x*16-this.offsetX;
   this.y=map_y*16-this.offsetY;
  }
});

/**
 * @scope Human.prototype
 */
var Human=enchant.Class.create(Character,{
  /**
   * @name Human
   * @class images/chara*.pngの仕様に合わせたCharacterクラス
   * @extends Character
   */
  initialize: function(x,y){
   Character.call(this,x,y,8,16,32,32);
   // 内部変数
   this._direction=0;
   this._state_frame=1;
   this.frame=1;

   /**
    * 何フレーム単位で方向を変えるか
    */
   this.direction_frame=3;

  },
  /**
   * キャラクターがどの方向を向いているか
   * 上: 3 左 1 右: 2 下: 0
   * @type Number
   */
  direction: {
   set: function(dir){
    this._direction=dir;
    this.frame=this._direction*this.direction_frame+this.frame%this.direction_frame;
   },
   get: function(){
    return this._direction;
   }
  },
  /**
   * 同じdirectionの画像内でのframe
   * @type Number
   */
  state_frame: {
   set: function(state_frame){
    this._state_frame=state_frame;
    this.frame=this.frame-(this.frame%this.direction_frame)+state_frame;
   },
   get: function(){
    return this._state_frame;
   }
  }
});

/**
 * @scope Knight.prototype
 */
var Knight=enchant.Class.create(Human,{
  /**
   * @name Knight
   * @class chara5,chara7の形式の画像に使うHuman
   * @param {Integer} x マップX座標
   * @param {Integer} y マップY座標
   * @extends Human
   */
  initialize: function(x,y){
   Human.call(this,x,y);
   this._state=0;
   this.direction_frame=9;
   this.state_length=3;
  },
  /**
   * 今何をしているか 何もしていない: 0, 盾: 1 , 剣:2
   */
  state: {
   get: function(){
    return this._state;
   },
   set: function(state){
    this._state=state;
    var state_frame=this.frame%this.state_length;
    this.frame=this.frame-this.frame%this.direction_frame+(state*this.state_length+state_frame);
   },
  },
  state_frame: {
   set: function(state_frame){
    this._state_frame=state_frame;
    this.frame=this.frame-(this.frame%this.state_length)+state_frame;
   },
   get: function(){
    return this._state_frame;
   }
  }
});

/**
 * @scope Player.prototype
 */
var Player=enchant.Class.create(Knight,{
  /**
   * @name Player
   * @class プレイヤー用オブジェクト 画像はchara5.pngを使用
   * @param {Integer} x マップX座標
   * @param {Integer} y マップY座標
   * @extends Knight
   */
  initialize: function(x,y){
   Knight.call(this,x,y);
   this.baseVelocity=4;
   /**
    * 体力
    * @type Number
    */
   this.hp=100000;
  },
  thinkingRoutine:function(){
   this.pushCommand(new this.walkInput(this,{}));
  },
  /**
   * 入力待機用コマンド
   * @type Command
   */
  walkInput:enchant.Class.create(Command,{
    cmdName: "!player.walkInput",
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
     // 次のコマンドが決まればpop
     return (typeof this.owner.queue[1] !=="undefined");
    }
  }),
  /**
   * {String|Array} properties.messagesは必須
   * @type Command
   */
  waitMessage:enchant.Class.create(Command,{
    initialize: function(owner,properties){
     if ( !(properties!=undefined && properties.messages!=undefined)){
      throw(new Error("missing property: messages"));
     }
     var messages=properties.messages;
     if(!(messages instanceof Array)){
      messages=[messages.toString()];
     }
     this.messages=messages.concat();
     this.mes_win=new MessageWindow();
     this.mes_win.set_message(this.messages[0]);
     this.flag=true;
    },
    action: function(){
     if(!this.mes_win.parentNode){
      this.mes_win.toggle_show();
     }
     if(game.input.Z){
      if(this.flag){
       this.messages.shift();
       if(this.messages[0]){
        this.mes_win.set_message(this.messages[0]);
       }else{
        this.mes_win.toggle_show();
       }
       this.flag=false;
      }
     }else{
      this.flag=true;
     }
    },
    popFlag: function(){
     return (this.messages.length==0)
    }
  }),
  /**
   * 別マップからオブジェクトを移行するためのオブジェクト
   * @returns {Object} 引き継ぎ用オブジェクト
   */
  takeOver: function(){
   return {
    hp: this.hp,
    direction: this.direction,
   }
  },
  damage: function(damage_val){
   this.hp-=damage_val;
  },
});

/**
 * @scope MapChip.prototype
 */
var MapChip=enchant.Class.create(Character,{
  /**
   * @name MapChip
   * @class マップチップのように振る舞うキャラクター
   * @extends Character
   */
  initialize:function(x,y){
   Character.call(this,x,y,0,0,16,16);
  }
});

/**
 * @scope MoveBot.prototype
 */
var MoveBot=enchant.Class.create(Human,{
  /**
   * @name MoveBot
   * @class 壁にぶつかったら向きを変えて歩くキャラクター
   * @extends Human
   */
  initialize: function(x,y){
   Human.call(this,x,y);
   this.baseVelocity=1;
   this.direction=2;
   this.preX=undefined;
   this.preY=undefined;
   this.moveArr=[3,1,0,2]
   this.moveIndex=this.moveArr.indexOf(this.direction);
   if(this.moveIndex<0){
    this.moveIndex=0;
   }
   this.pushCommand('wait',{count: 30});
  },
  thinkingRoutine: function(){
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

/**
 * @scope Spike.prototype
 */
var Spike=enchant.Class.create(MapChip,{
  /**
   * @name Spike
   * @class トゲクラス onの時に通れずoffの時に通れる
   * @extends MapChip
   */
  initialize: function(x,y){
   MapChip.call(this,x,y);
   this.state=false;
   this.frame=1;
   this.addEventListener("precommand",function(){
    this.damage_character();
   });
  },
  /**
   * SpikeのstateをOn/Offするクラス
   */
  toggle_on_off: enchant.Class.create(Command,{
    cmdName: "!spike.toggle_on_off",
    initialize: function(owner,properties){
     Command.call(this,owner,properties);
     this.executed=false;
    },
    action: function(){
     this.owner.state=!this.owner.state;
     this.owner.frame=(this.owner.state)?0:1;
     this.executed=true;
    },
    popFlag: function(){
     return this.executed;
    }
  }),
  /**
   * precommand用 衝突している相手にダメージを与える
   */
  damage_character: function(){
   if(!this.state){
    return;
   }
   var res=this.parentNode.checkHit(this);
   res.forEach(function(val){
    if(val.damage){
     val.damage(0.125);
    }
   });
  },
  isCollision: function(){
   return this.state;
  },
  thinkingRoutine: function(){
   // think+toggle_on_offで2フレーム消費
   var wait_count=(16/this.parentNode.parentNode.player.baseVelocity) || 4;
   this.pushCommand(new this.toggle_on_off(this,{}));
   // 入力待機のため+1
   this.pushCommand('wait',{count: wait_count*(this.state?2:10)-2+1});
   // this.pushCommand('wait',{count: 30-2});
  }
});

/**
 * @scope Stair.prototype
 */
var Stair=enchant.Class.create(MapChip,{
  /**
   * @name Stair
   * @class 階段(ワープ)クラス
   * @param {Integer} x マップX座標
   * @param {Integer} y マップY座標
   * @param {Integer} move_x 移動先X座標
   * @param {Integer} move_y 移動先Y座標
   * @param {String} [map_id] 移動先マップID 省略時同マップ
   * @extends MapChip
   */
  initialize: function(x,y,move_x,move_y,move_map_id){
   MapChip.call(this,x,y);
   this.frame=0;
   this.addEventListener("postcommand",function(){
    this.jumpOnChar();
   });
   this.target_pos={
    x: move_x,
    y: move_y
   };
   if(move_map_id){
    this.target_pos.id=move_map_id;
   }
  },
  isCollision: function(target){
   return false;
  },
  hitTest: function(target){
   return target.mapY==this.mapY && target.mapX == this.mapX
  },
  /**
   * 真上に乗ったキャラクターを飛ばす
   * もし同マップ内でキャラが居るなどの場合は何も起こさない
   */
  jumpOnChar: function(){
   if(this.target_pos.id){
    var res=this.parentNode.checkHit(this);
    if (res.length>0 && res[0] instanceof Player){
     map_manager.move_player(this.target_pos.id,this.target_pos.x,this.target_pos.y);
    }

   }else{
    var res=this.parentNode.checkHit(this);
    if (res.length>0){
     var dummy=new Character(0,0,0,0,40,40);
     var check_move=this.parentNode.checkHit(dummy);
     if(check_move.length==0){
      res[0].move_map(0,0);
     }
    }
   }
  }
});

/**
 * @scope InvisiblePlayerGate
 */
var InvisiblePlayerGate=enchant.Class.create(MapChip,{
  /**
   * @name InvisiblePlayerGate
   * @class プレイヤーのみを通すためのもの
   * @param {Integer} x マップX座標
   * @param {Integer} y マップY座標
   * @extends MapChip
   */
  initialize: function(x,y){
   MapChip.call(this,x,y);
  },
  isCollision: function(target){
   return !(target instanceof Player);
  }
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
  initialize:function(){
   enchant.Group.call(this);
   this.addEventListener("enterframe",this.execEachCommand);
  },

  /**
   * childNodesそれぞれと {@link Character#hitTest} を用いて衝突判定を行う。実行方法はchecker.hitTest(childNodes[i],hitTestOptions)
   * @param {Character} checker 衝突判定を行うオブジェクト。自分自身との衝突判定はスキップする。判定は内部のchildNodesの順に行われる。
   * @param {Object} [options={}] checkHitに対するオプション
   * @param {Integer} [options.maxLength=-1] TODO: 何個見つけたら判定を終了するか
   * @param {Object} [hitTestOptions={}]  それぞれのhitTestに渡すオプション
   * @param {String} [hitTestOptions.checkFunc="hitTest"] 衝突判定に使う関数 引数は(対象, オプション) オプションはhitTestと同一 文字列型の場合はcheckerのメソッドを参照する
   * @returns {Character []} 衝突していると判定されたキャラクターのリスト
   */
  checkHit: function(checker,options,hitTestOptions){
   // checkFunc実装
   var hits=[];
   var nodes=this.childNodes;
   var hitOpt=hitTestOptions || {};
   var opts=options || {};
   var maxLength=opts.maxLength||-1;
   var checkFunc=opts.checkFunc || "hitTest";
   if (!checker[checkFunc]){
    throw(new Error("checkFunc is undefined:"+ checkFunc));
   }
   for(i=0;i<nodes.length && (maxLength < 0 || hits.length<=maxLength);i++){
    if(nodes[i]===checker){
     continue;
    }
    if(checker[checkFunc](nodes[i],hitOpt)){
     hits.push(nodes[i]);
    }
   }
   return hits;
  },
  /**
   * ソートして見栄えを良くする
   * もしCharacterとMapChipの比較だった場合、MapChipを背面にする
   * そうでなければYでソート
   */
  sortY:function(){
   this.childNodes.sort(function(a,b){
    var a_sort=(a instanceof MapChip)? -1 : 1;
    var b_sort=(b instanceof MapChip)? -1 : 1;
    var ret=a_sort-b_sort;
    if (ret==0){
     ret=a.mapY-b.mapY;
    }
    return ret;
   });
  },
  /**
   * コマンドを実行する関数
   */
  execEachCommand: function(){
   this.childNodes.forEach(function(val,index,nodes){
    var e=new enchant.Event("precommand");
    val.dispatchEvent(e);

    val.doAction();

    // postcommand
    e=new enchant.Event("postcommand");
    val.dispatchEvent(e);

   });
  }
});

/**
 * @scope MapScene.prototype
 */
var MapScene=enchant.Class.create(enchant.Scene,{
  /**
   * @name MapScene
   * @class マップや必要情報をシーンに内包させてpopScene/pushSceneと言った形式で扱えるようにしたもの
   * @param {Player} player プレイヤーオブジェクト
   * @param {enchant.Map} bgMap 背景/衝突判定マップ
   * @param {enchant.Map} fgMap 前景アップ
   * @extends enchant.Scene
   */
  initialize:function(player,bgMap,fgMap){
   enchant.Scene.call(this);
   this.characterList=new CharactersList();
   this.bgMap=bgMap;
   this.fgMap=fgMap || null;
   this.player=player;
   //  FPS表示用
   this.lbl=new MutableText(0,16,game.width);
   this.hpLabel=new MutableText(0,0,game.width);
   this.sumFPS=0;
   this.addChild(this.bgMap);
   this.addChild(this.characterList);
   if(this.fgMap){
    this.addChild(this.fgMap);
   }
   this.addChild(this.lbl);
   this.addChild(this.hpLabel);
   this.addEventListener('enterframe',function(e){
    this.enterframe();
    this.focusToPlayer();
   });
   this.addCharacters(this.player);
  },
  /**
   * キャラクターの追加
   */
  addCharacters: function(character){
   this.characterList.addChild(character);
  },
  /**
   * プレイヤーを中心としてマップを移動する
   */
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
  },
  enterframe: function(e){
   // FPS計算
   this.sumFPS+=game.actualFps;
   if(game.frame%10==0){
    this.lbl.setText("FPS:"+Math.round(this.sumFPS/10));
    this.sumFPS=0;
   }
   // ソート
   this.characterList.sortY();
   // HP表示
   this.hpLabel.setText("HP:"+this.player.hp);
  },
});

/**
 * @scope MessageWindow.prototype
 */
var MessageWindow=enchant.Class.create(enchant.Group,{
  /**
   * @name MessageWindow
   * @class メッセージを表示させるクラス
   * @param {Integer} x 表示させるx座標
   * @param {Integer} y 表示させるy座標
   * @extends enchant.Group
   */
  initialize: function(x,y){
   enchant.Group.call(this);
   this.bg=new Sprite(game.width,game.height);
   this.bg.backgroundColor="#ffffff";
   this.label=new Label();
   this.label.font='16px Osaka-mono, "Osaka-等幅", "MS ゴシック",monospace';
   this.addChild(this.bg);
   this.addChild(this.label);
   this.shown=false;

   // 座標指定
   this.x=0;
   this.y=0;
   this.label.x=5;
   this.label.y=5;
  },
  /**
   * メッセージを変える。ついでに大きさと場所も変える
   * @param {String} text 表示する文字列．\nは改行に変換される．
   */
  set_message: function(text){
   this.label.text=text.replace(/\n/g,"<br>");
   var scene=game.currentScene;
   var width=this.label._boundWidth;
   var height=this.label._boundHeight;
   this.x=(scene.width-width)/2;
   this.y=(scene.height-height)/2;
   this.bg.width=width+10
   this.bg.height=height+10
   this.write_border();
  },
  /**
   * 表示/非表示を切り替える
   */
  toggle_show: function(){
   if(this.parentNode){
    this.parentNode.removeChild(this);
   }else{
    var scene=game.currentScene;
    scene.addChild(this);
   }
  },
  write_border: function(){
   var bg_img=new Surface(this.bg.width,this.bg.height);
   bg_img.context.fillStyle="#ffffff";
   bg_img.context.fillRect(0,0,bg_img.width,bg_img.height);
   bg_img.context.strokeStyle="#000000";
   bg_img.context.lineWidth=2;
   bg_img.context.strokeRect(2,2,bg_img.width-4,bg_img.height-4);
   this.bg.image=bg_img;
  }
});

/**
 * @scope MapManager.prototype
 */
var MapManager=enchant.Class.create({
  /**
   * @name MapManager
   * @class MapScene管理クラス
   */
  initialize: function(){
   this.map_list={};
   this.core=null;
   /**
    * 現在のマップID
    * @type String
    */
   this.now_map=null;
  },
  /**
   * マップ追加関数
   * @param {String} マップ名
   * @param {MapScene} マップデータ
   */
  add_map: function(map_name,mapscene){
   this.map_list[map_name]=mapscene;
  },
  /**
   * マップ切り替えのためのenchant.Coreを設定
   */
  set_core: function(core){
   if (!core instanceof enchant.Core){
    throw new TypeError("core is not enchant.Core");
   }

   this.core=core;
  },

  /**
   * プレイヤーのデータを移動させてcurrentSceneを指定したIDのMapSceneに変える
   */
  move_player: function(map_id,map_x,map_y){
   if(!this.map_list[map_id]){
    throw new Error("map_id is undefined: " + map_id);
   }
   var new_map=this.map_list[map_id];
   if(this.core.currentScene instanceof MapScene){
    var player=this.core.currentScene.player;

    // 引き継ぎ
    var obj=player.takeOver();
    for(var param in obj){
     new_map.player[param]=obj[param];
    }
    this.core.popScene();
   }

   new_map.player.move_map(map_x,map_y);
   // 既に積んでいたキューは空にする
   new_map.player.queue.length=0;
   this.now_map=map_id;
   this.core.pushScene(new_map);
  }
});
