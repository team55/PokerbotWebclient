
/**
 *  This file holds the SERVER instance to handle all server side
 *  communications. It is used as an interface for the server, mainly used
 *  by the CLIENT instance.
 */

 const CREATE_TABLE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/makeTable.php'


/**
 *  This server instance should be globally available and provides an interface
 *  to communicate with the real server. The instance does not hold any data.
 *  ALL requests to the server should be sent via this instance.
 */
var SERVER = {

  /**
   *  Creates a new table on the Server with the given table name, password
   *  and maximum number of players. The function will only be executed if the
   *  amount of seats is an integer.
   */
  createTable: function(tablename, password, seats, success, fail, final) {
    $.ajax({url: createTableURL, method: 'POST', success: function(result) {
      Logger.hideCreateTableError();
      Logger.log('Tafel "' + table + '" aangemaakt!<br />Je kan er nu aan plaatsnemen.', 'CREATETABLE');
      if (callback) callback();
    }, error: function(error) {
      Logger.error('Er is een probleem opgetreden...', 'CREATETABLE');
    }, data: {
      'name': table,
      'password': password,
      'nbPlayers': seats
    }});
  },

  /**
   *  Connects the given user to the given table with a GET request.
   */
  connect: function(username, table, callback) {
    var destination = "http://bear.cs.kuleuven.be/pokerdemo/server/hello.php?tableName=";
    destination += table + "&playerName=" + username;
    $.ajax({url: destination, success: function(result) {
      try {
        var data = JSON.parse(result);
        if (data['type'] === 'Acknowledge') {
          Client.signin(username, table, callback);
        } else {
          Logger.error(data['message'], 'SIGNIN');
        }
      } catch (err) {
        Logger.error('Woops, looks like something went wrong.', 'SIGNIN');
      }
    }, error: function(error) {
      Logger.error(error, 'SIGNIN');
    }});
  },

  tableData: function(table) {
    destination = "http://bear.cs.kuleuven.be/pokerdemo/server/watchTable.php?tableName=";
    destination += table;
    $.ajax({url: destination, success: function(result) {
      // TODO: TABLE DATA RECEIVED, SHOULD LOAD IN SOME DIV.
    }, error: function(error) {
      // TODO: HANDLE ERROR. JUST LOG IT IN SOME DIV?
    }});
  },

  sendRule: function(username, table, code) {
    $('#rulesendbtn').addClass('disabled');
    destination = "http://bear.cs.kuleuven.be/pokerdemo/server/joinTable.php?tableName=";
    destination += table + "&playerName=" + username + "&description=" + encodeURIComponent(code);
    $.ajax({url: destination, success: function(result) {
      $('#sendstatuspusher').hide();
      $('#sendstatus').transition('swing left');
      window.setTimeout(function() {
        $('#sendstatus').transition('swing left', function() {
          $('#sendstatuspusher').show();
          $('#rulesendbtn').removeClass('disabled');
        });
      }, 3000);
      // TODO: REPLY, LOG?
    }, error: function(error) {
      $('#rulesendbtn').removeClass('disabled');
      // TODO: HANDLE ERROR. JUST LOG IT IN SOME DIV?
    }});
  },



}
