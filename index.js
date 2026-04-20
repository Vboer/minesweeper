const config = {
    columns: 10,
    rows: 10,
    get tile_quantity() {
    return this.columns * this.rows;
        },
    tile_size: 20,
    mines_quantity: 8,
    mine_symbol: "*",
    flag_symbol: "|>"
};
//calculate mines positions 
const all_tiles = new Array(config.tile_quantity).fill("");
place_mines (all_tiles, config.mines_quantity);
count_mines (all_tiles);

//render field
const field = document.querySelector("#field");
field.style["grid-template-columns"] = `repeat(${config.columns}, 1fr)`;
field.style.width = `${(config.tile_size + 1) * config.columns}px`;
field.style.height = `${(config.tile_size + 1) * config.rows}px`;

//render tiles on a field
for (let i = 0; i < (config.tile_quantity); i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.width = `${config.tile_size}px`;
    tile.style.height = `${config.tile_size}px`;
    tile.id = i;
    tile.addEventListener("click", open_cell)
    tile.addEventListener("contextmenu", place_flag) //add text from array (move in separate class to make prettier)

    field.appendChild(tile);
}




function place_mines (arr, mines_quantity) {
let counter = mines_quantity;
    while (counter > 0) {
        arr_index = Math.random() * arr.length | 0;
        if (arr[arr_index] == 0){
            counter--;
            arr[arr_index] = config.mine_symbol;
        }
    }
};
function count_mines (arr){
arr.map((element, index, array) => {
    if (element != config.mine_symbol){
        const indeces_to_check = array_of_tiles_around_tiles (index);
        //count number of mines around the tile
        const number_of_mines_around = indeces_to_check.reduce((sum, element) => {
            return sum +(arr[element] == config.mine_symbol ? 1 : 0);
        }, 0);
        if (number_of_mines_around > 0) arr[index] = number_of_mines_around;
    };
});
}
function array_of_tiles_around_tiles (index) {
        tl = index - 1 - config.columns;
        tt = index - config.columns;
        tr = index + 1 - config.columns;
        cl = index - 1;
        cr = index + 1; 
        bl = index - 1 + config.columns;
        bb = index + config.columns;
        br = index + 1 + config.columns;
        // remove indeces outside of left and right borders
        switch (index%config.columns) {
            case 0:
                indeces = [tt, tr, cr, bb, br];
                break;
            case config.columns -1:
                indeces = [tl, tt, cl, bl, bb];
                break;
            default:
                indeces = [tl, tt, tr, cl, cr, bl, bb, br]
        }
        //remove indeces outside top and bottom borders
        return indeces.filter(element => (element >= 0) && (element < config.tile_quantity)); 
}

function open_cell () {
        const mine = document.createElement("p");
        const text = document.createTextNode(`${all_tiles[this.id]}`);
        mine.appendChild(text);
        this.style.backgroundColor = "white";
        this.appendChild(mine);
}
function place_flag () {
    if (this.childNodes[0].textContent == config.flag_symbol){
        this.childNodes[0].remove();
    } else {
    const flag = document.createElement("p");
    const text = document.createTextNode(`${config.flag_symbol}`);
    flag.appendChild(text);
    this.appendChild(flag);
    };
}