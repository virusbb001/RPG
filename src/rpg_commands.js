
// コマンドオブジェクト生成
function termCommands(){
 var data={
  player: player,
  mob:mob,
  mob2: mob2,
  spike: spike
 };
 var termObj={
  objs: function(){
   for(i in data){
    this.echo(i);
   }
  },
  echo: function(){
   if(arguments.length==0){
    this.echo("echo [String]");
   }else{
    var term=this;
    Array.prototype.slice.call(arguments).forEach(function(i){
     term.echo(i);
    });
   }
  },
  where: function(){
   this.echo("(" + player.mapX + ", "+player.mapY+")");
  },
  commands: function(){
   for(i in commands){
    this.echo(i);
   }
  },
  help: function(){
   for(var i in termObj){
    this.echo(i);
   }
  },
  queue: function(){
   var self=this;
   player.queue.forEach(function(cmd,index){
    self.echo(index+" : "+cmd.toString());
   });
  },
  setTimeoutTest: (function(){
   var i;
   return function(self){
    if(typeof self==="undefined"){
     i=0;
     self=this;
    }
    i++;
    self.echo(i);
    if(i<5){
     setTimeout(arguments.callee,1000,self);
    }
   };
  })(),
  walk: function(){
   var directionStr=["down","left","right","up"];
   if(arguments.length<1 || arguments[0] == "help"){
    this.echo("walk *direction* [times]")
    this.echo("歩くコマンドを追加する");
    this.echo("引数");
    this.echo("direction down: 下 left: 左 right: 右 up: 上");
    this.echo("times: 回数\n\tデフォルト: 1\n\t0は1として扱われる");
   }else{
    var direction=arguments[0]-0;
    var times=arguments[1] || 1;
    if(isNaN(direction)){
     direction=directionStr.indexOf(arguments[0].toLowerCase());
    }

    if(direction < 0 || 3< direction){
     this.echo("方向の指定がおかしい");
    }else if(times<0){
     this.echo("回数に負の値は指定できない");
    }else{
     for(var i=0;i<times;i++){
      player.pushCommand('walk',{direction: direction});
     }
     this.echo("walk "+directionStr[direction]+"を"+(times > 1 ? times +"回": "") + "追加" );
    }
   }
  },
  watch: function(){
   player.pushCommand("watch",{});
  }
 };

 return termObj;
}

function getTermCommands(){
 // 呼び出される時はtermObj[command].apply(term,args)
 var now_map_id=map_manager.now_map
 var chara=map_manager.map_list[now_map_id].availableChara;
 var termObj={
  help: function(){
   for(var i in termObj){
    this.echo(i);
   }
  },
  walk: function(dir,count){
   var player=chara.player;
   var directionStr=["down","left","right","up"];
   if(arguments.length<1 || dir == "help"){
    this.echo("walk *direction* [times]")
    this.echo("歩くコマンドを追加する");
    this.echo("引数");
    this.echo("direction down: 下 left: 左 right: 右 up: 上");
    this.echo("times: 回数\n\tデフォルト: 1\n\t0は1として扱われる");
   }else{
    var direction=dir-0;
    var times=count || 1;
    if(isNaN(direction)){
     direction=directionStr.indexOf(dir.toLowerCase());
    }

    if(direction < 0 || 3< direction){
     this.echo("方向の指定がおかしい");
    }else if(times<0){
     this.echo("回数に負の値は指定できない");
    }else{
     for(var i=0;i<times;i++){
      player.pushCommand('walk',{direction: direction});
     }
     this.echo("walk "+directionStr[direction]+"を"+(times > 1 ? times +"回": "") + "追加" );
    }
   }
  }
 };

 return termObj;
}
