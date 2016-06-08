var game;
var gridArr = []
var colrowNum = 6
var gridSize = 100
window.onload = function() {	
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
     preload: function(){
          game.load.image("grid", "grid.png");
          game.load.image("bg", "bg.png");
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     },
     create: function(){
          for(i=0;i<colrowNum;i++){
              gridArr[i]=[];
              for(j=0;j<colrowNum;j++){
                  grid = game.add.sprite( gridSize * j + gridSize/2,gridSize * i + gridSize/2, "grid");
                  grid.anchor.set(0.5);
                  gridArr[i][j] = {obj:grid, x:grid.x, y:grid.y};

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
         
        if(this.checkGrid(row,col-1)!= -1){
            this.tweenAction(this.checkGrid(row,col-1),this.checkGrid(row,col) );
        }
        if(this.checkGrid(row,col+1)!= -1) 
          this.tweenAction(this.checkGrid(row,col+1),this.checkGrid(row,col));
        if(this.checkGrid(row+1,col)!= -1) 
          this.tweenAction(this.checkGrid(row+1,col),this.checkGrid(row,col));
        if(this.checkGrid(row-1,col)!= -1) 
          this.tweenAction(this.checkGrid(row-1,col),this.checkGrid(row,col));
          
     },
     tweenAction: function(from,to){
        fromObj = from.obj 
        toObj  = to.obj

        if(fromObj!=null){

          fromMove = game.add.tween(fromObj).to({
            x: to.x,
            y: to.y
          }, 200, Phaser.Easing.Linear.None, true);

          fromMove.onComplete.add(function(){
              from.obj.destroy()
              to.obj.destroy()
              grid = game.add.sprite( to.x,to.y, "grid");
              grid.anchor.set(0.5);
              to.obj = grid
          })
        }
       
        
     },
     update: function(){
           
     },
    
}