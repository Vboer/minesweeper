"use strict";

//setup data
const config = {
  columns: 10,
  rows: 10,
  get tile_quantity() {
    return this.columns * this.rows;
  },
  tile_size: 20,
  mines_quantity: 10,
  mine_symbol: "*",
  flag_symbol: "|>",
};

const all_tiles = new Array(config.tile_quantity).fill("");
const counters = {
  flag_counter: 0,
  wrong_flags_counter: 0,
  opened_tiles: 0
};

//calculate mines positions
place_mines(all_tiles, config.mines_quantity);
count_mines(all_tiles);

//render field
const field = document.querySelector("#field");
field.style["grid-template-columns"] = `repeat(${config.columns}, 1fr)`;
field.style.width = `${(config.tile_size + 1) * config.columns}px`;
field.style.height = `${(config.tile_size + 1) * config.rows}px`;

//render tiles on a field
for (let i = 0; i < config.tile_quantity; i++) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.style.width = `${config.tile_size}px`;
  tile.style.height = `${config.tile_size}px`;
  tile.id = i;
  tile.addEventListener("click", open_cell);
  tile.addEventListener("contextmenu", place_flag); //add text from array (move in separate class to make prettier)

  field.appendChild(tile);
}

//ligic functions
function place_mines(arr, mines_quantity) {
  let counter = mines_quantity;
  while (counter > 0) {
    arr_index = (Math.random() * arr.length) | 0;
    if (arr[arr_index] == 0) {
      counter--;
      arr[arr_index] = config.mine_symbol;
    }
  }
}
function count_mines(arr) {
  arr.map((element, index, array) => {
    if (element != config.mine_symbol) {
      const indeces_to_check = array_of_tiles_around_tiles(index);
      //count number of mines around the tile
      const number_of_mines_around = indeces_to_check.reduce((sum, element) => {
        return sum + (arr[element] == config.mine_symbol ? 1 : 0);
      }, 0);
      if (number_of_mines_around > 0) arr[index] = number_of_mines_around;
    }
  });
}
function array_of_tiles_around_tiles(index) {
  tl = index - 1 - config.columns;
  tt = index - config.columns;
  tr = index + 1 - config.columns;
  cl = index - 1;
  cr = index + 1;
  bl = index - 1 + config.columns;
  bb = index + config.columns;
  br = index + 1 + config.columns;
  // remove indeces outside of left and right borders
  switch (index % config.columns) {
    case 0:
      indeces = [tt, tr, cr, bb, br];
      break;
    case config.columns - 1:
      indeces = [tl, tt, cl, bl, bb];
      break;
    default:
      indeces = [tl, tt, tr, cl, cr, bl, bb, br];
  }
  //remove indeces outside top and bottom borders
  return indeces.filter(
    (element) => element >= 0 && element < config.tile_quantity,
  );
}

//ui functions
function open_cell() {
  if (!this.firstChild) {
    const mine = document.createElement("p");
    const text = document.createTextNode(`${all_tiles[this.id]}`);
    mine.appendChild(text);
    this.classList.add("open");
    this.appendChild(mine);

    counters.opened_tiles++;

    lose_game(all_tiles, this.id);
    win_game();

    //move it to several different functions
    if (all_tiles[this.id] == "") {
      const arr_to_open = array_of_tiles_around_tiles(Number(this.id));
      arr_to_open.map((element) => {
        if (all_tiles[element] != config.mine_symbol)
          open_cell.call(document.getElementById(`${element}`));
      });
    }
  }
}
function place_flag() {
  if (!this.classList.contains("open")) {
    if (this.firstChild) {
      this.removeChild(this.firstChild);

      counters.flag_counter--;

      if (all_tiles[this.id] != config.mine_symbol)

        counters.wrong_flags_counter--;
        
    } else {
      const flag = document.createElement("p");
      const text = document.createTextNode(`${config.flag_symbol}`);
      flag.appendChild(text);
      this.appendChild(flag);

      counters.flag_counter++;
      if (all_tiles[this.id] != config.mine_symbol)
        counters.wrong_flags_counter++;

      win_game();
    }
  }
}
function win_game() {
  if (
    counters.flag_counter == config.mines_quantity &&
    counters.wrong_flags_counter == 0 &&
    counters.opened_tiles + counters.flag_counter == config.tile_quantity
  ) {
    end_game("You've won");
  }
}
function end_game(message) {
  const all_tiles = document.querySelectorAll(".tile");
  all_tiles.forEach((tile) => {
    tile.removeEventListener("click", open_cell);
    tile.removeEventListener("contextmenu", place_flag);
    tile.style["background-color"] = "green";
  });
  alert(`${message}`); //add reset function
}
function lose_game(array, index) {
  if (array[index] === config.mine_symbol) {
    end_game("You've lost");
  }
}
