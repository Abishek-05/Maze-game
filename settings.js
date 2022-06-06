let sliderDiv = document.querySelector(".sliderDiv"); //Entire slider block
let slider = document.querySelector("#myRangeSlider");//Slider
slider.oninput = function() //anonymous function
{
	timer = this.value;
}

let form = document.querySelector("#settings");
let rowsCols = document.querySelector("#dimensions");
//call generateMaze() on submission of form
form.addEventListener("submit",generateMaze);

let newMaze; //Keep this object global coz we'll use this in move() also....we can create new object also but its waste of time as we can resue this object itself.
let dims;//dimensions
let solution = document.querySelector('.solution');
function generateMaze(event) 
{
	event.preventDefault();

	let mazeSize = 500;
	dims = rowsCols.value;
	if(dims == "")
		return alert("Please fill all the fields!!!");

	if(dims > 40)
		return alert("Maze is too large!!!");
	if(dims <= 0)
		return alert("Maze size must be between 1 and 40");
	
	form.style.display = "none"; //Once we get the input remove the form
	sliderDiv.style.display = ""; //Display the hidden slider
	newMaze = new Maze(mazeSize,dims,dims);
	newMaze.setup();
	newMaze.draw();
}

let completed = document.querySelector('.completed');
let replay = document.querySelector('.replay');
let close = document.querySelector('.close');
let gameEle = document.querySelector('.game-container');

replay.addEventListener('click',() => {
	gameEle.style.opacity = '100%'; //Display the grid again after blurring
	location.reload();
});

close.addEventListener('click', () => {
	gameEle.style.opacity = '100%';
	completed.style.display = "none";
});

//Movement
document.addEventListener('keydown',move);
function move(event)
{
	let key = event.key;
	let curr_row,curr_col;
	if(key == 'ArrowUp' || key == 'ArrowRight' || key == 'ArrowDown' || key == 'ArrowLeft') //Keep track of only arrow keys
	{
		curr_row = current.rowNum;
		curr_col = current.colNum;
	}
	if(generationComplete == false || completed.style.display == "" || soln_flag == true) //If user presses solution then keys are disabled
		return;
	let next = undefined;
	if(key == 'ArrowUp' && current.walls.topWall == false)
		next = newMaze.grid[curr_row-1][curr_col];

	else if(key == 'ArrowRight' && current.walls.rightWall == false)
		next = newMaze.grid[curr_row][curr_col+1];

	else if(key == 'ArrowDown' && current.walls.bottomWall == false)
		next = newMaze.grid[curr_row+1][curr_col];

	else if(key == 'ArrowLeft' && current.walls.leftWall == false)
			next = newMaze.grid[curr_row][curr_col-1];

	if(next) //if next exist, make current cell black and next cell yellow
	{
		current.highlight(dims,dims,'black');
		current = next;
		current.highlight(dims,dims,'yellow');
	}
	curr_row = current.rowNum;
	curr_col = current.colNum;
	if(curr_row == dims-1 && curr_col == dims-1)
	{
		completed.style.display = "";
		gameEle.style.opacity = '20%';
	}
}
