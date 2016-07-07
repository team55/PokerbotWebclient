
var createTableURL = 'http://bear.cs.kuleuven.be/pokerdemo/server/makeTable.php';

var API = {

  /**
   *  Creates a new table on the Server with the given table name, password
   *  and maximum number of players. The function will only be executed if the
   *  amount of seats is an integer.
   */
  createTable: function(table, password, seats) {
    if (seats === parseInt(seats, 10)) {
      $.ajax({url: createTableURL, method: 'POST', success: function(result) {
        Logger.log('Table "' + table + '" should be created...');
      }, error: function(error) {
        Logger.error('Woops, should check it again');;
      }, data: {
        'name': table,
        'password': password,
        'nbPlayers': seats
      }});
    } else {
      Logger.error('Invalid number of seats.');
    }
  }

}
