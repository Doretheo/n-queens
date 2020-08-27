// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // get the rows and store in a variable
      var eachRow = this.get(rowIndex);
      var sideLength = this.get('n');
      // get the length of the side
      // create a counter variable
      var counter = 0;
      // iterate through the row using the length of the side
      for (var i = 0; i < sideLength; i++) {
        // add each row's value to the counter

        counter += eachRow[i];
      }
      // if counter is greater than 1, return true;
      return counter > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var sideLength = this.get('n');
      // iterate through the sideLength
      for (var i = 0; i < sideLength; i++) {
        // if the call hasRowConflictAt with each i index is true
        if (this.hasRowConflictAt(i)) {
          // return true
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // create variable to store number of columns
      var sideLength = this.get('n');
      // counter variable = 0
      var counter = 0;
      // iteratre through the rows
      for (var i = 0; i < sideLength; i++) {
        // var to store number of rows
        var eachRow = this.get(i);
        // add to counter, each row at i
        counter += eachRow[colIndex];
      }
      // return if counter is greater than 1
      return counter > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var sideLength = this.get('n');
      // iterate through the sideLength
      for (var i = 0; i < sideLength; i++) {
        // if the call hasRowConflictAt with each i index is true
        if (this.hasColConflictAt(i)) {
          // return true
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // variable to store side length
      var sideLength = this.get('n');
      // add counter variable
      var counter = 0;
      // add row counter
      var rowIndex = 0;
      var columnIndex = majorDiagonalColumnIndexAtFirstRow;

      // create a start variable for major
      // for loop with condition, if row < sideLength, columns < sideLength,
      for (; rowIndex < sideLength && columnIndex < sideLength; rowIndex++, columnIndex++) {
        // if (columnIndex > 0) then run
        // store to counter each row taking index i in a variable
        if ( columnIndex >= 0) {
          var eachRow = this.get(rowIndex);
          counter += eachRow[columnIndex];
        }

        // counter += {Row, Column}
        // [{0,-3}, {1,-2}, {2,-1}, !{3,0}!]
        // [{4,-3}, {5,-2}, {6,-1}, !{7,0}!]
        // [{0,-3}, {1,-2}, {2,-1}, !{3,0}!]
      }
      return counter > 1;
      // if counter is greater than 1, return true

    },



    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var sideLength = this.get('n');
      // iterate through the first row
      // passing into the function: [-3, -2, -1, 0, 1, 2, 3];
      for (var i = 1 - sideLength; i < sideLength; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal-on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // variable to store side length
      var sideLength = this.get('n');
      // add counter variable
      var counter = 0;
      // add row counter
      var rowIndex = 0;
      var columnIndex = minorDiagonalColumnIndexAtFirstRow;


      // create a start variable for major
      // for loop with condition, if row < sideLength, columns < sideLength,
      for (; rowIndex < sideLength && columnIndex >= 0; rowIndex++, columnIndex--) {
        // if (columnIndex > 0) then run
        // store to counter each row taking index i in a variable
        if ( columnIndex < sideLength) {
          var eachRow = this.get(rowIndex);
          counter += eachRow[columnIndex];
        }

        // counter += {Row, Column}
        // [{0,-3}, {1,-2}, {2,-1}, !{3,0}!]
        // [{4,-3}, {5,-2}, {6,-1}, !{7,0}!]
        // [{0,-3}, {1,-2}, {2,-1}, !{3,0}!]
      }
      return counter > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var sideLength = this.get('n');
      // iterate through the first row
      // passing into the function: [-3, -2, -1, 0, 1, 2, 3];
      for (var i = sideLength + sideLength - 2; i >= 0; i--) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
