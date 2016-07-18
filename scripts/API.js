
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
        $('#createerror').html('');
        $('#createlog').html('Tafel "' + table + '" aangemaakt!<br />Je kan er nu aan plaatsnemen.');
      }, error: function(error) {
        $('#createerror').html('Er is een probleem opgetreden...');
      }, data: {
        'name': table,
        'password': password,
        'nbPlayers': seats
      }});
    } else {
      $('#createerror').html('Ongeldig aantal plaatsen.');
    }
  },

  sendRules: function(username, table, rules) {
    destination = "http://bear.cs.kuleuven.be/pokerdemo/server/joinTable.php?tableName=";
    destination += table + "&playerName=" + username + "&description=" + encodeURIComponent(rules);
    $.ajax({url: destination, method: 'GET', success: function(result) {
      // TODO: Handle success.
      console.log('Rules submitted');
    }, error: function(error) {
      // TODO: Handle error.
      console.err('Error occured when submitting rules: ' + error);
    }});
  }

}
