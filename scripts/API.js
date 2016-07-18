

var API = {


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
