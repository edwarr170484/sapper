class Cell {
  constructor(row, column, size) {
    this.position = {
      row: row,
      column: column,
    };

    this.coords = {
      x1: column * size,
      y1: row * size,
      x2: column * size + size,
      y2: row * size + size,
    };

    this.size = size;
    this.neighbors = null;
  }

  checkCoordinates(x, y) {
    return (
      x >= this.coords.x1 &&
      x <= this.coords.x2 &&
      y >= this.coords.y1 &&
      y <= this.coords.y2
    );
  }

  checkPosition(row, column) {
    return this.position.row === row && this.position.column === column;
  }

  draw(context) {
    context.lineWidth = "1";
    context.strokeStyle = "gray";
    context.strokeRect(this.coords.x1, this.coords.y1, this.size, this.size);
  }
}

class Grid {
  constructor(rows, columns, cellSize = 50) {
    this.cells = [];
    this.rows = rows;
    this.columns = columns;
    this.cellSize = cellSize;
    this.context = null;
  }

  init() {
    for (let row = 0; row < this.rows; row++) {
      let cellsRow = [];
      for (let column = 0; column < this.columns; column++) {
        const cell = new Cell(row, column, this.cellSize);
        cell.neighbors = this.defineCellNeighbors(row, column);
        cellsRow.push(cell);
      }
      this.cells.push(cellsRow);
    }

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.cells[row][column].neighbors = this.connectNeighbors(
          this.cells[row][column]
        );
      }
    }

    return this;
  }

  getCellByCoords(x, y) {
    return this.getCellByParams(x, y, "Coordinates");
  }

  getCellByPosition(row, column) {
    return this.getCellByParams(row, column, "Position");
  }

  getCellByParams(p1, p2, param) {
    let row = this.cells.filter((row) => {
      let f = row.filter((cell) => {
        return cell[`check${param}`](p1, p2);
      });

      return f.length > 0;
    });

    const cell =
      row.length > 0
        ? row[0].filter((cell) => {
            return cell[`check${param}`](p1, p2);
          })
        : null;

    return cell ? cell[0] : null;
  }

  defineCellNeighbors(row, column) {
    return [
      row > 0 && column > 0 ? [row - 1, column - 1] : null,
      row > 0 ? [row - 1, column] : null,
      row > 0 && column < this.columns - 1 ? [row - 1, column + 1] : null,
      column > 0 ? [row, column - 1] : null,
      column < this.columns - 1 ? [row, column + 1] : null,
      row < this.rows - 1 && column > 0 ? [row + 1, column - 1] : null,
      row < this.rows - 1 ? [row + 1, column] : null,
      row < this.rows - 1 && column < this.columns - 1
        ? [row + 1, column + 1]
        : null,
    ];
  }

  connectNeighbors(cell) {
    let newNeighbors = cell.neighbors.map((neighbor) => {
      return neighbor ? this.getCellByPosition(neighbor[0], neighbor[1]) : null;
    });

    return newNeighbors;
  }

  selectCell(event) {
    let canvasCoords = {
      x: event.target.offsetLeft,
      y: event.target.offsetTop,
    };

    let mouseCoords = {
      x: event.clientX,
      y: event.clientY,
    };

    return this.getCellByCoords(
      mouseCoords.x - canvasCoords.x,
      mouseCoords.y - canvasCoords.y
    );
  }
  draw() {
    const canvas = document.createElement("canvas");
    canvas.id = "gridContainer";
    canvas.setAttribute("width", this.cellSize * this.columns);
    canvas.setAttribute("height", this.cellSize * this.rows);
    canvas.style.width = `${this.cellSize * this.columns}px`;
    canvas.style.height = `${this.cellSize * this.rows}px`;

    document.body.append(canvas);

    this.context = canvas.getContext("2d");

    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.draw(this.context);
      });
    });

    canvas.addEventListener("click", (event) => {
      const cell = this.selectCell(event);
    });
  }
}

const grid = new Grid(10, 10, 50);
grid.init().draw();
