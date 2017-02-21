
var game;
var gridArr = [];
var colrowNum = 6;
var gridSize = 100;
var gamelevel = [
                  ["1,2","3,2","2,1","2,3"],
                  ["1,2","3,2","2,1","2,3","1,3"],
                  ["1,2","3,2","2,1","2,3","1,3","3,4"],
                  ["1,3","2,2","3,1","2,4","3,4"],
                  ["1,2","1,3","3,1","2,4","3,4"],
                  ["0,2","1,3","2,0","2,1","3,1","5,1"]
                ];
 
var currentlvl = 0;


window.onload = function() {	
	   game = new Phaser.Game(600, 600, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame",true,false,gamelevel[currentlvl]);
}

var playGame = function(game){};

playGame.prototype = {
    init:function(gamelevel){
        this.gamelevel = gamelevel;
    },
     preload: function(){
          game.load.image("grid", "grid.png");
          game.load.image("refresh", "recurring.png");
          game.load.image("bg", "bg.png");
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     },
     create: function(){
        // game.stage.backgroundColor = "#ffffff";

        style = { font: "bold 30px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        lvl = currentlvl+1
        text = game.add.text(10, 10, "Game level "+lvl, style);
        text.align = 'center';

        button = game.add.button(game.world.width-10, 10, 'refresh', this.reloadlvl,this);
        button.width = 40;
        button.height = 40;
        button.anchor.set(1,0);

          for(i=0;i<colrowNum;i++){
              gridArr[i]=[];
              for(j=0;j<colrowNum;j++){
                  tmr_arr = i+","+j;
                  grid = game.add.sprite( gridSize * j + gridSize/2,gridSize * i + gridSize/2, "grid");
                  grid.anchor.set(0.5);
                  gridArr[i][j] = {obj:grid, x:grid.x, y:grid.y};

                  if(this.gamelevel.indexOf(tmr_arr)<0){
                    gridArr[i][j].obj.destroy()
                  }

              }
          }
          game.input.onDown.add(this.clickgrid, this);
     },
      checkGrid : function(row,col){
        if(row<0 || row>=colrowNum || col<0 || col>=colrowNum){
          return -1;
        }
          return gridArr[row][col];
       
     },
     clickgrid: function(e){
        row = Math.floor(game.input.y / gridSize);
        col = Math.floor(game.input.x / gridSize);

        checkCount = 0
        if(this.checkGrid(row,col).obj.alive){
          return false;
        }
        if(this.checkGrid(row,col-1)!= -1 && this.checkGrid(row,col-1).obj.alive)
          checkCount++
        if(this.checkGrid(row,col+1)!= -1 && this.checkGrid(row,col+1).obj.alive) 
          checkCount++
        if(this.checkGrid(row+1,col)!= -1 && this.checkGrid(row+1,col).obj.alive) 
          checkCount++
        if(this.checkGrid(row-1,col)!= -1 && this.checkGrid(row-1,col).obj.alive) 
          checkCount++

        if(checkCount>=2){
              if(this.checkGrid(row,col-1)!= -1)
                this.tweenAction(this.checkGrid(row,col-1),this.checkGrid(row,col) );
              if(this.checkGrid(row,col+1)!= -1) 
                this.tweenAction(this.checkGrid(row,col+1),this.checkGrid(row,col));
              if(this.checkGrid(row+1,col)!= -1) 
                this.tweenAction(this.checkGrid(row+1,col),this.checkGrid(row,col));
              if(this.checkGrid(row-1,col)!= -1) 
                this.tweenAction(this.checkGrid(row-1,col),this.checkGrid(row,col));
        }
       
          
     },
     detectWinorNot:function(){
        aliveGrid = 0;
        for(i=0;i<colrowNum;i++){
            for(j=0;j<colrowNum;j++){
                if(gridArr[i][j].obj.alive ) aliveGrid++;
            }
        }
        
        if(aliveGrid==1){
          this.youWin()
        }
     },
     tweenAction: function(from,to){
        fromObj = from.obj 
        toObj  = to.obj

        if(fromObj!=null){

          fromMove = game.add.tween(fromObj).to({
            x: to.x,
            y: to.y
          }, 200, Phaser.Easing.Linear.None, true);

          that = this;
          fromMove.onComplete.add(function(){
              from.obj.destroy()

              to.obj.destroy()
              grid = game.add.sprite( to.x,to.y, "grid");
              grid.anchor.set(0.5);
              to.obj = grid;

              that.detectWinorNot();

          })
        }
       
        
     },
     youWin:function(){
        var style = { font: "bold 100px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        text = game.add.text(game.world.centerX, game.world.centerY, "You Win", style);
        text.anchor.set(0.5);
        text.align = 'center';
        game.input.onDown.add(this.nextlevel, this);

     },
     nextlevel:function(){
        game.input.onDown.remove(this.nextlevel)
        currentlvl++;
        game.state.start("PlayGame",true,false,gamelevel[currentlvl]); 
     },
     reloadlvl:function(){
        game.state.start("PlayGame",true,false,gamelevel[currentlvl]); 
     },
     update: function(){
          
     }
    

}