let maze = document.querySelector('.maze');
let ctx = maze.getContext('2d');
let thickness = 2;
let timer=500;
let current; //Global variable which refernces current cell in the grid
let generationComplete=false;
class Maze
{
	constructor(size,rows,columns)
	{
		this.size = size; //Size in pixels for displaying the grid
		this.rows = rows;
		this.columns = columns;
		this.grid = [];
		this.stack = [];
	}
	setup()
	{
		for(let r=0; r < this.rows; r++)
		{
			let rowarr = [];
			for(let c=0; c < this.columns; c++)
			{
				let cell = new Cell(r,c,this.grid,this.size) //Instantiate each cell
				rowarr.push(cell); //Push each cell into row
			}
			this.grid.push(rowarr); //Push each row into grid
		}
		current = this.grid[0][0]; //Maze generation starts from top left of grid
	}

	draw() //Draw the grid by calling show() for each cell
	{
		maze.width = this.size;
		maze.height = this.size;
		maze.style.background = 'black';
		maze.style.border = '7px solid firebrick';
		current.visited = true;

		for(let r=0; r < this.rows; r++)
		{
			for(let c=0; c < this.columns; c++)
			{
				let grid = this.grid;
				grid[r][c].show(this.size,this.rows,this.columns);
			}
		}

		let next = current.checkNeighbours(); //randomly select which neighbour to visit next

		if(next) // if next exists
		{
			this.stack.push(current); //push current node into stack
			current.removeWall(current,next);
			current.highlight(this.rows,this.columns,'yellow');
			current = next;
		}
		//if if is not executed (ie) no neighbours to visit, we go to backtracking step
		else if(this.stack.length > 0) //Backtracking step
		{
			let req_cell = this.stack.pop(); //Pop the topmost cell in stack
			current = req_cell; //replace it with current cell
			current.highlight(this.rows,this.columns,'yellow');
		}

		else if(this.stack.length == 0)
		{
			current.highlight(this.rows,this.columns,'yellow');
			this.grid[this.rows-1][this.columns-1].highlight(this.rows,this.columns,'lightgreen'); //Make destination as green
			generationComplete = true;
			sliderDiv.style.opacity = "0%"; //Hide the slider after generation
			solution.style.display="";//Show solution drop down menu
			// console.log(current);
			alert("Please start solving the maze. Use arrow keys to play !!"); //Prompt to ask user to play
			return;
		}
		window.requestAnimationFrame(() => {
			setTimeout(() => {
			this.draw();},1010-timer);
		});	
		/*
		A better version of setTimeout() for smoother animation
		draw() is recursively called inside requestAnimationFrame to create the actual animation
		Used setTimeout() to slow the animation
		We use arrow func () => if our func requires this to call eg . here we do
		this.draw */
	}
}
class Cell
{
	constructor(rowNum,colNum,parentGrid,parentSize)
	{
		this.rowNum = rowNum;
		this.colNum = colNum;
		this.parentGrid = parentGrid;
		this.parentSize = parentSize;
		this.visited = false;
		this.walls = { topWall:true, rightWall:true, bottomWall:true, leftWall:true }; //To hold status of each wall (ie.) if the wall is intact or broken
	}

	//Now we define 4 functions for 4 walls
	drawTopWall(x,y,rows,columns,size) //Size is size of parentGrid
	{
		ctx.beginPath(); //To start creating a path
		ctx.moveTo(x,y); //Represent top left corner of cell x,y
		ctx.lineTo(x + (size/columns), y); //Our req. line is from top left of cell to top right
		ctx.stroke(); //Draws the actual line
	}
	drawRightWall(x,y,rows,columns,size)
	{
		ctx.beginPath();
		ctx.moveTo(x + (size/columns),y); //Move to right top
		ctx.lineTo(x + (size/columns) ,y + (size/rows));//Line from right top to right bottom
		ctx.stroke(); //Draw it
	}
	drawBottomWall(x,y,rows,columns,size)
	{
		ctx.beginPath();
		ctx.moveTo(x,y+(size/rows));
		ctx.lineTo(x + (size/columns), y + (size/rows));
		ctx.stroke();
	}
	drawLeftWall(x,y,rows,columns,size)
	{
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x, y + (size/rows));
		ctx.stroke();
	}
	
	highlight(rows,columns,colour)
	{
		//Added some constants to make highlighter a tad bit smaller than the cell
		let x = (this.colNum * this.parentSize)/columns + 3;
		let y = (this.rowNum * this.parentSize)/rows + 3;
		let tot_cell_width = this.parentSize/columns;
		ctx.fillStyle = colour;
		//Made some alignments to ensure proper filling of colour
		if(colour == 'black')
			ctx.fillRect(x-1,y-1, tot_cell_width - 5,tot_cell_width-5)
		else
			ctx.fillRect(x,y,tot_cell_width - 7,tot_cell_width-7)
	}

	removeWall(cell1,cell2)
	{
		//If two cells are adjacent alone x axis, remove the corrseponding common wall
		let x = cell1.colNum - cell2.colNum;
		if(x == -1)
		{
			cell1.walls.rightWall = false;
			cell2.walls.leftWall = false;
		}
		else if(x == 1)
		{
			cell1.walls.leftWall = false;
			cell2.walls.rightWall = false;
		}

		//Do similarly for y axis
		let y = cell1.rowNum - cell2.rowNum;
		if(y == -1)
		{
			cell1.walls.bottomWall = false;
			cell2.walls.topWall = false;
		}
		else if(y == 1)
		{
			cell1.walls.topWall = false;
			cell2.walls.bottomWall = false;
		}
	}
	show(size,rows,columns)
	{
		let x = (this.colNum * size)/columns; //Actual x position of cell in pixels eg(1,2) => 200px along x and 100px along y (if we assume size = 500px and rows = columns = 10);
		let y = (this.rowNum * size)/rows;

		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'black';
		ctx.lineWidth = thickness;

		if(this.walls.topWall == true)
			this.drawTopWall(x,y,rows,columns,size);
		if(this.walls.rightWall == true)
			this.drawRightWall(x,y,rows,columns,size);
		if(this.walls.bottomWall == true)
			this.drawBottomWall(x,y,rows,columns,size);
		if(this.walls.leftWall == true)
			this.drawLeftWall(x,y,rows,columns,size);
	}

	checkNeighbours() //For every cell, keeps track of its neighbours
	{
		let grid = this.parentGrid;
		let curr_row = this.rowNum;
		let curr_col = this.colNum;
		let neighbours = []; 

		let topNeighbour,bottomNeighbour,leftNeighbour,rightNeighbour;

		if(curr_row == 0) //top neighbour does not exist
			topNeighbour = undefined;
		else
			topNeighbour = grid[curr_row-1][curr_col];

		if(curr_row == grid.length-1) //bottom neighbour does not exist
			bottomNeighbour = undefined;
		else
			bottomNeighbour = grid[curr_row+1][curr_col];

		if(curr_col == 0) //left neighbour does not exist
			leftNeighbour = undefined;
		else
			leftNeighbour = grid[curr_row][curr_col-1];

		if(curr_col == grid.length-1) //right neighbour does not exist
			rightNeighbour = undefined;
		else
			rightNeighbour = grid[curr_row][curr_col+1];


		//push neighbours which have not been visited so that we can choose one at random at next iteration to visit
		if(topNeighbour && !topNeighbour.visited) //if top is not undefined and not visited
			neighbours.push(topNeighbour);

		if(rightNeighbour && !rightNeighbour.visited)
			neighbours.push(rightNeighbour);

		if(bottomNeighbour && !bottomNeighbour.visited)
			neighbours.push(bottomNeighbour);

		if(leftNeighbour && !leftNeighbour.visited)
			neighbours.push(leftNeighbour);

		if(neighbours.length !== 0) //!= compares by value, !== compares by both value and type
		{
			let random_num = Math.floor(Math.random() * neighbours.length); //random() gives a float number from 0 to 1
			return neighbours[random_num];
		}
		else
			return undefined;
	}
}
