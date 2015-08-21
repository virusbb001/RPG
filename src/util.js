(function(window,undefined){
  window.RPG_Util={};

  /**
   * 2次元の迷路を生成する.
   * 穴掘り法
   * @param {Integer} width 横幅のサイズ
   * @param {Integer} height 縦幅のサイズ
   * @return {Array[][]} 迷路データ falseが道
   */
  RPG_Util.generateMaze=function(width,height){
   if(width === undefined || height === undefined){
    throw new Error("arguments is not enough");
   }

   var map=new Array(height);
   for(var i=0;i<height;i++){
    map[i]=new Array(height);
    for(var j=0;j<map[i].length;j++){
     map[i][j]=true;
    }
   }

   var dig_maze=function(x,y){
    if(map[y][x]){
     map[y][x]=false;
    }
    var direction=[
     [-1,0],
     [1,0],
     [0,-1],
     [0,1]];
    var aliveDir=new Array(direction.length);
    for(var i=0;i<aliveDir.length;i++){
     aliveDir[i]=i;
    }
    var n=aliveDir.length;
    for(var i=n-1;i>0;i--){
     var j=Math.floor(Math.random()*(i+1));
     var tmp=aliveDir[i];
     aliveDir[i]=aliveDir[j];
     aliveDir[j]=tmp;
    }
    // 全ての方向に対して処理
    for(var i=0;i<aliveDir.length;i++){
     var dx=direction[aliveDir[i]][0];
     var dy=direction[aliveDir[i]][1];
     // console.log("("+dx+","+dy+")");
     // 範囲外か判定
     if(x+(dx*2) < 0 || y + (dy*2) < 0 || x+(dx*2) >= width || y+(dy*2) >= height){
      continue;
     }
     // 2マス先が壁
     if(map[y+(dy*2)][x+(dx*2)]){
      // その方向に壁を伸ばす
      map[y+dy][x+dx]=false;
      dig_maze(x+(dx*2),y+(dy*2));
     }
    }
   };

   var x=Math.floor(Math.random()*((width-2)/2))*2+1;
   var y=Math.floor(Math.random()*((height-2)/2))*2+1;
   dig_maze(x,y);

   return map;
  };

  /**
   * generateMazeで生成したデータをenchant.Map方式に変換する
   * mazeはそのまま衝突判定に使われる
   * @returns {enchant.Map}
   */
  RPG_Util.convertMaze2Map=function(maze){
   if(!window.enchant){
    throw new Error("enchant is not defined");
   }

   var floor=64;
   var wall=7;
   var wall_floor=23;

   var map=new enchant.Map(16,16);
   var height=maze.length;
   var width=maze[0].length;

   // 画像指定
   var graphic=new Array(height);
   for(var i=0;i<height;i++){
    graphic[i]=new Array(width);
    for(var j=0;j<width;j++){
     var pic;
     if( (i+1)<height && !(maze[i+1][j]) && maze[i][j]){
      pic=wall_floor;
     }else{
      pic=(maze[i][j]?wall:floor);
     }
     graphic[i][j]=pic;
    }
   }

   map.loadData(graphic);
   map.collisionData=maze;

   return map;
  };

})(window);

