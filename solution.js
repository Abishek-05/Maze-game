let stack = [];
let queue = [];
let parentArray = Array.from(Array(dims), () => new Array(dims)); //2d array
let open = new Map();
let closed = new Map();
let grid;
var n;
var t,k;
var overall_flag = false;
var dfs_flag = false;
var bfs_flag = false;
var astar_flag = false;
var soln_flag = false; //Once user asks for soln, game mode is disabled

let soln = document.querySelector('#soln');
soln.addEventListener('change',function(event){

	soln_flag = true;
	if(overall_flag == false) //If user changes option in the middle of solution, we need to reset things back to original state
	{
		k = current; //Save the postion where user asks for solution. Do not make changes to this variable k
		overall_flag = true;
	}
	current = k;

	if(event.target.value == 'DFS')
	{
		dfs_flag = true;
		bfs_flag = false;
		astar_flag = false;
		dfs();
	}
	else if(event.target.value == 'BFS')
	{
		dfs_flag = false;
		bfs_flag = true;
		astar_flag = false;
		bfs();
	}
	else if(event.target.value == 'A* Algorithm')
	{
		dfs_flag = false;
		bfs_flag = false;
		astar_flag = true;
		aStar();
	}
});

// ***** NON-RANDOMIZED DFS *****
function dfs()
{
	sliderDiv.style.opacity = '100%';
	grid = newMaze.grid;
	n = grid.length;
	stack = [];
	for(var i=0; i<n; i++)
	{
		for(var j=0; j<n; j++)
		{
			grid[i][j].visited = false;
			grid[i][j].highlight(n,n,'black'); //set all cells to black initially
		}
	}
	grid[n-1][n-1].highlight(n,n,'lightgreen');//Destination is set as green
	t = current; //Save the curent before modifying it
	stack.push(current);
	current.visited = true;

	function myFunc() 
	{
		current = stack[stack.length-1];
		current.visited = true;

		if(current.rowNum == n-1 && current.colNum == n-1)
		{
			current.highlight(n,n,'lightgreen');
			current = t; //Replace current to where it was initally when user asked for solution
			current.highlight(n,n,'yellow'); //Make starting point as yellow

			return;
		}
		addStackNeighbours(current);

		if(dfs_flag == true)
		{
			window.requestAnimationFrame(() => {
			setTimeout(myFunc,1010-timer);
			});
		}	
		else //If user presses some other solution option, abruptly halt this, reset everything and return
		{
			for(var i=0; i<n; i++)
			{
				for(var j=0; j<n; j++)
				{
					grid[i][j].visited = false;
					grid[i][j].highlight(n,n,'black'); //set all cells to black initially
				}
			}
			grid[n-1][n-1].highlight(n,n,'lightgreen');
			return;
		}
	}
	myFunc(); //Call function initially, then setTimeout will call it in regular intervals
}
function addStackNeighbours(cell)
{
	let curr_row = cell.rowNum;
	let curr_col = cell.colNum;
	let prev_len = stack.length;

	cell.highlight(n,n,'blue');
	if(curr_row != 0 && cell.walls.topWall == false && grid[curr_row-1][curr_col].visited == false)
		stack.push(grid[curr_row-1][curr_col]);

	if(curr_col != n-1 && cell.walls.rightWall == false && grid[curr_row][curr_col+1].visited == false)
		stack.push(grid[curr_row][curr_col+1]);

	if(curr_row != n-1 && cell.walls.bottomWall == false && grid[curr_row+1][curr_col].visited == false)
		stack.push(grid[curr_row+1][curr_col]);

	if(curr_col != 0 && cell.walls.leftWall == false && grid[curr_row][curr_col-1].visited == false)
		stack.push(grid[curr_row][curr_col-1]);
		
	if(stack.length == prev_len)
	{
		cell.highlight(n,n,'red');
		stack.pop();
	}
}

//***** BFS *****
function bfs()
{
	sliderDiv.style.opacity = '100%';
	grid = newMaze.grid;
	n = grid.length;
	queue = [];
	let dummy = new Cell(0,0,1,1); //initialize parent array with dummy cell

	for(var i=0; i<n; i++)
		parentArray[i] = {}; //syntax to define a 2d array. We have declared it globally
		
	for(var i=0; i<n; i++)
	{
		for(var j=0; j<n; j++)
		{
			grid[i][j].visited = false;
			grid[i][j].highlight(n,n,'black'); //set all cells to black initially
			parentArray[i][j] = dummy; //Assign dummy to all cells of parentArray
		}
	}
	grid[n-1][n-1].highlight(n,n,'lightgreen');
	t = current; //Save the curent before modifying it
	parentArray[current.rowNum][current.colNum] = current; //Current cell will not have a parent. So assign it as current itself
	queue.push(current);
	current.visited = true;
	function myFunc() 
	{
		current = queue.shift(); //pop 1st ele
		//make it visited inside addQueueNeighbours()
		if(current.rowNum == n-1 && current.colNum == n-1)
		{	
			current.highlight(n,n,'lightgreen');
			//Colouring the path
			current = t; //Replace current to where it was initally when user asked for solution
			let curr_cell = parentArray[dims-1][dims-1];
			while(curr_cell != current)
			{
				curr_cell.highlight(dims,dims,'blue');
				curr_cell = parentArray[curr_cell.rowNum][curr_cell.colNum]; //Trace back the path from parent array
			}
			curr_cell.highlight(dims,dims,'yellow');
			return;
		}
		addQueueNeighbours(current,parentArray);

		if(bfs_flag == true)
		{
			window.requestAnimationFrame(() => {
			setTimeout(myFunc,1010-timer);
			});
		}
		else
		{
			for(var i=0; i<n; i++)
			{
				for(var j=0; j<n; j++)
				{
					grid[i][j].visited = false;
					grid[i][j].highlight(n,n,'black');
					parentArray[i][j] = dummy;
				}
			}
			grid[n-1][n-1].highlight(n,n,'lightgreen');
			return;
		}
	}
	myFunc();
}
function addQueueNeighbours(cell,parentArray)
{
	let curr_row = cell.rowNum;
	let curr_col = cell.colNum;

	cell.highlight(n,n,'red');
	if(curr_row != 0 && cell.walls.topWall == false && grid[curr_row-1][curr_col].visited == false)
	{
		grid[curr_row-1][curr_col].visited = true;
		queue.push(grid[curr_row-1][curr_col]);
		parentArray[curr_row-1][curr_col] = cell;
	}
	if(curr_col != n-1 && cell.walls.rightWall == false && grid[curr_row][curr_col+1].visited == false)
	{
		grid[curr_row][curr_col+1].visited = true;
		queue.push(grid[curr_row][curr_col+1]);
		parentArray[curr_row][curr_col+1] = cell;
	}
	if(curr_row != n-1 && cell.walls.bottomWall == false && grid[curr_row+1][curr_col].visited == false)
	{
		grid[curr_row+1][curr_col].visited = true;
		queue.push(grid[curr_row+1][curr_col]);
		parentArray[curr_row+1][curr_col] = cell;
	}
	if(curr_col != 0 && cell.walls.leftWall == false && grid[curr_row][curr_col-1].visited == false)
	{
		grid[curr_row][curr_col-1].visited = true;
		queue.push(grid[curr_row][curr_col-1]);
		parentArray[curr_row][curr_col-1] = cell;
	}
}

//***** A* Algorithm *****
function aStar()
{
	sliderDiv.style.opacity = '100%';
	grid = newMaze.grid;
	n = grid.length;

	open = new Map();
	closed = new Map();

	for(var i=0; i<n; i++)
		for(var j=0; j<n; j++)
			grid[i][j].highlight(n,n,'black'); //set all cells to black initially

	grid[n-1][n-1].highlight(n,n,'lightgreen');
	t = current; //Save the curent before modifying it

	let f = distance(current);
	let g = 0;
	let h = f + g;
	let par = current;
	open.set(current,{fscore:f, gscore:g, hscore:h,parent:par});

	function myFunc()
	{
		let [valMin] = open.values();
		let [keyMin] = open.keys();
		for(var [key,value] of open) //get key with lowest hscore
		{
			if(value.hscore < valMin.hscore || value.hscore == valMin.hscore && value.fscore < valMin.fscore) 
			{
				keyMin = key;
				valMin = value;
			}
		}
		current = keyMin;
		g =  open.get(current).gscore;
		f = distance(current);
		h = f + g;
		par = open.get(current).parent;

		open.delete(current); //Delete it
		closed.set(current,{fscore:f, gscore:g, hscore:h,parent:par}); //Once we delete it from open[], we dont visit it again

		if(current.rowNum == n-1 && current.colNum == n-1)
		{	
			current.highlight(n,n,'lightgreen');
			//Colouring the path
			let curr_cell = par;
			current = t; //Replace current to where it was initally when user asked for solution
			while(curr_cell != t) //Parent of start vertex was itself
			{
				curr_cell.highlight(n,n,'blue');
				curr_cell = closed.get(curr_cell).parent; //Trace back the path using parent
			}
			curr_cell.highlight(n,n,'yellow');
			return;
		}

		let neighbours = aStarNeighbours(current);
		for(let i=0; i<neighbours.length; i++)
		{
			if (closed.has(neighbours[i]))
				continue;
			g += 1;
			f = distance(neighbours[i]);
			h = f + g;
			par = current; 

			if(open.has(neighbours[i]))//if key exits in open
			{	
				if(g < open.get(neighbours[i]).gscore)
					open.set(neighbours[i],{fscore:f, gscore:g, hscore:h,parent:par});
			}
			else
				open.set(neighbours[i],{fscore:f, gscore:g, hscore:h,parent:par});
		}
		if(astar_flag == true)
		{
			window.requestAnimationFrame(() => {
				setTimeout(myFunc,1010-timer);
			});
		}	
		else
		{
			for(var i=0; i<n; i++)
				for(var j=0; j<n; j++)
					grid[i][j].highlight(n,n,'black');
			grid[n-1][n-1].highlight(n,n,'lightgreen');
			return;
		}
	}
	myFunc();
}
function aStarNeighbours(cell)
{
	let curr_row = cell.rowNum;
	let curr_col = cell.colNum;
	let temp = [];

	cell.highlight(n,n,'red');
	if(curr_row != 0 && cell.walls.topWall == false)
		temp.push(grid[curr_row-1][curr_col]);

	if(curr_col != n-1 && cell.walls.rightWall == false)
		temp.push(grid[curr_row][curr_col+1]);

	if(curr_row != n-1 && cell.walls.bottomWall == false)
		temp.push(grid[curr_row+1][curr_col]);

	if(curr_col != 0 && cell.walls.leftWall == false)
		temp.push(grid[curr_row][curr_col-1]);
	
	return temp;
}
function distance(cell)
{
	var x = dims - 1 - cell.rowNum;
	var y = dims - 1 - cell.colNum;

	return x+y;
}
