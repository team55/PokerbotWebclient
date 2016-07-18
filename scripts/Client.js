
/**
 *  Instance to store client side actions like showing and hiding divs.
 *  The client instance also stores a username and table when the user
 *  is connected to a table.
 */
var Client = {

  username: "",
  table: "",
  showprolog: false,

  signin: function(username, table) {
    this.username = username;
    this.table = table;
    $('#login').hide();
    $('#username').val('');
    $('#tablename').val('');
    $('#status').html('Signed in as "' + username + '" on table "' + table + '".');
    $('#controls').show();
    $('#preview').show();
    $('#workDiv').show();
  },

  signout: function() {
    this.username = '';
    this.table = '';
    $('#login').show();
    $('#status').html('');
  },

  toggleprolog: function() {
    if (this.showprolog) {
      this.showprolog = false;
      $('#preview').hide();
    } else {
      this.showprolog = true;
      $('#preview').show();
    }
  },

  /**
   *  Checks whether or not a user is connected to a table.
   *  Can be used to check before sending rules etc.
   */
  isSignedIn: function() {
    return !(this.username === "")
            && !(this.table === "");
  }

}
