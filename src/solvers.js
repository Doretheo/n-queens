/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.totalSolutions = function(board, startRow, n, validator, cb) {
  if (startRow === n) {
    return cb();
  }

  for (var colIndex = 0; colIndex < n; colIndex++) {
    board.togglePiece(startRow, colIndex);
    if (!board[validator]()) {
      totalSolutions(board, startRow + 1, n, validator, cb);
    }
    board.togglePiece(startRow, colIndex);
  }
};

//input: a single number
//output:
//togglePiece (rowIndex, colIndex)
window.findNRooksSolution = function(n) {
  var solution;
  var board = new Board({'n': n});

  totalSolutions(board, 0, n, 'hasAnyRooksConflicts', function() {
    solution = _.map(board.rows(), function(row) {
      return row.slice();
    });
  });

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({'n': n});

  totalSolutions(board, 0, n, 'hasAnyRooksConflicts', function() {
    solutionCount++;
  });

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({'n': n});
  var solution = board.rows();

  totalSolutions(board, 0, n, 'hasAnyQueensConflicts', function() {
    solution = _.map(board.rows(), function(row) {
      return row.slice();
    });
  });

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({'n': n});

  totalSolutions(board, 0, n, 'hasAnyQueensConflicts', function() {
    solutionCount++;
  });

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
