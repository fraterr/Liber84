export class Watchtower {
  constructor(name, data) {
    this.name = name;
    this.grid = data; // 13 rows of 12 letters
  }
  
  getCell(row, col) {
    return this.grid[row][col];
  }
  
  getSubQuadrant(quadrantName) {
    // Quadrant mapping: Top-Left, Top-Right, Bottom-Left, Bottom-Right
    const bounds = {
      'Top-Left': { rStart: 0, rEnd: 5, cStart: 0, cEnd: 4 },
      'Top-Right': { rStart: 0, rEnd: 5, cStart: 7, cEnd: 11 },
      'Bottom-Left': { rStart: 7, rEnd: 12, cStart: 0, cEnd: 4 },
      'Bottom-Right': { rStart: 7, rEnd: 12, cStart: 7, cEnd: 11 }
    };
    return bounds[quadrantName];
  }
}

export class EnochianCore {
  constructor(tableData) {
    this.towers = {
      Air: new Watchtower('Air', tableData.Air),
      Water: new Watchtower('Water', tableData.Water),
      Earth: new Watchtower('Earth', tableData.Earth),
      Fire: new Watchtower('Fire', tableData.Fire)
    };
  }

  get_great_cross() {
    let cells = [];
    for(let c = 0; c < 12; c++) {
      cells.push({r: 6, c: c});
    }
    for(let r = 0; r < 13; r++) {
      if(r !== 6) {
        cells.push({r: r, c: 5});
        cells.push({r: r, c: 6});
      }
    }
    return cells;
  }

  get_calvary_cross(towerId, quadrantName) {
    const tower = this.towers[towerId];
    const bounds = tower.getSubQuadrant(quadrantName);
    let cells = [];
    // vertical arm: col 2, rows 0 to 5
    for(let r = 0; r <= 5; r++) {
      cells.push({r: bounds.rStart + r, c: bounds.cStart + 2});
    }
    // horizontal arm: row 1, cols 0 to 4
    for(let c = 0; c <= 4; c++) {
      if(c !== 2) {
        cells.push({r: bounds.rStart + 1, c: bounds.cStart + c});
      }
    }
    return cells;
  }

  get_holy_names(towerId) {
    const grid = this.towers[towerId].grid;
    const rowString = grid[6];
    
    const name1 = rowString.substring(0, 3);
    const name2 = rowString.substring(3, 7);
    const name3 = rowString.substring(7, 12);
    
    let cells1 = [], cells2 = [], cells3 = [];
    for(let i=0; i<3; i++) cells1.push({r: 6, c: i});
    for(let i=3; i<7; i++) cells2.push({r: 6, c: i});
    for(let i=7; i<12; i++) cells3.push({r: 6, c: i});

    return {
      names: [name1, name2, name3],
      cells: [...cells1, ...cells2, ...cells3],
      crossCells: this.get_great_cross()
    };
  }

  get_king(towerId) {
    const grid = this.towers[towerId].grid;
    // Colonna centrale: index 6. First 11 characters.
    let name = "";
    let cells = [];
    for(let r = 0; r < 11; r++) {
      name += grid[r][6];
      cells.push({r: r, c: 6});
    }
    return {
      name,
      cells,
      crossCells: this.get_great_cross()
    };
  }

  get_kerubic_angels(towerId, quadrantName) {
    const tower = this.towers[towerId];
    const bounds = tower.getSubQuadrant(quadrantName);
    let name = "";
    let cells = [];
    // Row 0 of subquadrant, excluding col 2
    for (let c = 0; c <= 4; c++) {
      if (c !== 2) {
        name += tower.getCell(bounds.rStart + 0, bounds.cStart + c);
        cells.push({r: bounds.rStart + 0, c: bounds.cStart + c});
      }
    }
    return {
      name,
      cells,
      crossCells: this.get_calvary_cross(towerId, quadrantName)
    };
  }

  get_servient_angels(towerId, quadrantName) {
    const tower = this.towers[towerId];
    const bounds = tower.getSubQuadrant(quadrantName);
    let angels = [];
    // Rows 2, 3, 4, 5 of subquadrant, excluding col 2
    for (let r = 2; r <= 5; r++) {
      let name = "";
      let cells = [];
      for (let c = 0; c <= 4; c++) {
        if (c !== 2) {
          name += tower.getCell(bounds.rStart + r, bounds.cStart + c);
          cells.push({r: bounds.rStart + r, c: bounds.cStart + c});
        }
      }
      angels.push({
        name,
        cells,
        crossCells: this.get_calvary_cross(towerId, quadrantName)
      });
    }
    return angels;
  }

  extractAll() {
    const towers = ['Air', 'Water', 'Earth', 'Fire'];
    const quadrants = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'];
    
    let result = {};
    towers.forEach(tower => {
      result[tower] = {
        HolyNames: this.get_holy_names(tower),
        King: this.get_king(tower),
        Quadrants: {}
      };
      quadrants.forEach(q => {
        result[tower].Quadrants[q] = {
          Kerubic: this.get_kerubic_angels(tower, q),
          Servient: this.get_servient_angels(tower, q)
        };
      });
    });
    return result;
  }
}
