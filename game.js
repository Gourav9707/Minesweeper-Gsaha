let field = document.getElementById("field");
let modal = document.getElementById("modal");
let modal_content = document.getElementById("mcontent");
let grid = [];
let guesscorect;
let reset = false;
let clk = new Audio("click.wav");
let wn = new Audio("win.wav");
let ls = new Audio("loose.mp3");

function Cell(n) {
  this.disp = false;
  if (n === 1) this.bomb = true;
  else this.bomb = false;
}

function playagain() {
  window.location.reload();
}

function makebox() {
  let totalbomb = 0;
  for (let i = 0; i < 9; i++) {
    let arr = [];
    let countbomb = 0;
    let row = document.createElement("div");
    row.className = "row";
    row.setAttribute("id", "row");
    for (let j = 0; j < 9; j++) {
      let x = Math.round(Math.random());
      if (x === 1 && countbomb != 3) {
        arr[j] = new Cell(x);
        countbomb++;
      } else {
        arr[j] = new Cell(0);
      }
      let cell = document.createElement("div");
      cell.className = "cell center";
      cell.setAttribute("id", i.toString() + j.toString());
      row.appendChild(cell);
    }
    totalbomb = totalbomb + countbomb;
    field.appendChild(row);
    grid.push(arr);
  }
  guesscorect = 81 - totalbomb;
  console.log(guesscorect);
}

let lost = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j].bomb === true && grid[i][j].disp === false) {
        document.getElementById(i.toString() + j.toString()).style.background =
          "red";
      }
    }
  }
  ls.play();
  console.log("you Loose");
  modal.classList.remove("visible");
  modal_content.innerHTML = "You Loose!!";
};

let win = () => {
  wn.play();
  reset = true;
  console.log("you win");
  modal.classList.remove("visible");
  modal_content.innerHTML = "Congrats!!You Win..";
};

let countneighbourbomb = (i, j) => {
  //pure function to only count neighbouring bombs
  let count = 0;
  for (let itrack = -1; itrack <= 1; itrack++) {
    for (let jtrack = -1; jtrack <= 1; jtrack++) {
      if (
        i + itrack > -1 &&
        i + itrack < 9 &&
        j + jtrack > -1 &&
        j + jtrack < 9 &&
        grid[i + itrack][j + jtrack].bomb === true &&
        grid[i + itrack][j + jtrack].disp === false
      ) {
        count++;
        console.log("adding count for" + (i + itrack) + " " + (j + jtrack));
      }
    }
  }
  return count;
};

let reveal = (i, j) => {
  let arr = []; // saving the valid neighbour cells in an array arr
  for (let itrack = -1; itrack <= 1; itrack++) {
    for (let jtrack = -1; jtrack <= 1; jtrack++) {
      if (
        i + itrack > -1 &&
        i + itrack < 9 &&
        j + jtrack > -1 &&
        j + jtrack < 9 &&
        grid[i + itrack][j + jtrack].bomb === false &&
        grid[i + itrack][j + jtrack].disp === false
      ) {
        arr.push([i + itrack, j + jtrack]);
      }
    }
  }
  console.log(arr);
  for (let k = 0; k < arr.length; k++) {
    let ik = arr[k][0];
    let jk = arr[k][1];
    console.log(ik + " " + jk + " find bomb for it");
    let count = countneighbourbomb(ik, jk);
    grid[ik][jk].disp = true;
    guesscorect--;
    console.log(guesscorect);
    if (count === 0) {
      document.getElementById(ik.toString() + jk.toString()).innerHTML = "";
      document.getElementById(ik.toString() + jk.toString()).style.background =
        "#cccccc";
    } else {
      document.getElementById(ik.toString() + jk.toString()).innerHTML = count;
      document.getElementById(ik.toString() + jk.toString()).style.background =
        "#cccccc";
    }
    if (guesscorect <= 0) win();
  }
};

let display = (id) => {
  clk.play();
  let i = parseInt(id[0]);
  let j = parseInt(id[1]);
  if (grid[i][j].disp === false && grid[i][j].bomb === true) {
    document.getElementById(id).style.background = "red";
    reset = true;
    grid[i][j].disp = true;
    lost();
    return;
  }
  if (grid[i][j].disp === false && grid[i][j].bomb === false) {
    grid[i][j].disp = true;
    let count = countneighbourbomb(i, j);
    guesscorect--;
    console.log(guesscorect);
    if (count === 0) {
      document.getElementById(id).innerHTML = ""; //if no bomb nearby display will be null and explore the neighbour cells
      document.getElementById(id).style.background = "#cccccc";
      reveal(i, j); // call to explore neighbour cells
    } else {
      document.getElementById(id).innerHTML = count;
      document.getElementById(id).style.background = "#cccccc";
    }
    if (guesscorect <= 0) win();
  }
};

let handleclick = () => {
  let el = event.target;
  if (el.id !== "field" && el.id !== "row" && reset === false) {
    display(el.id);
  }
};

makebox();
document
  .querySelector("#field")
  .addEventListener("click", (event) => handleclick(event));
