
/**
 *  This Server instance can be used to communicate with the server. It is used
 *  to fetch debug logs (about the connection), send the prolog data and retrieve
 *  information about online tables.
 */
var Server = {

  connect: function(username, table) {
    destination = "http://bear.cs.kuleuven.be/pokerdemo/server/hello.php?tableName=";
    destination += table + "&playerName=" + username
    $.ajax({url: destination, success: function(result) {
      var data = JSON.parse(result);
      console.log(data['message']);
      // TODO: SET THE USER WHEN SUCCESS. ANGULARJS?
    }, error: function(error) {
      // TODO: HANDLE ERROR. JUST LOG IT IN SOME DIV?
    }});
  }

  tableData: function(table) {
    destination = "http://bear.cs.kuleuven.be/pokerdemo/server/watchTable.php?tableName=";
    destination += table;
    $.ajax({url: destination, success: function(result) {
      // TODO: TABLE DATA RECEIVED, SHOULD LOAD IN SOME DIV.
    }, error: function(error) {
      // TODO: HANDLE ERROR. JUST LOG IT IN SOME DIV?
    }});
  }

  sendRule: function(username, table, code) {
    destination = "http://bear.cs.kuleuven.be/pokerdemo/server/joinTable.php?tableName=";
    destination += table + "&playerName=" + username + "&description=" + encodeURIComponent(code);
    $.ajax({url: destination, success: function(result) {
      // TODO: REPLY, LOG?
    }, error: function(error) {
      // TODO: HANDLE ERROR. JUST LOG IT IN SOME DIV?
    }});
  }

}
