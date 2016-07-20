
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
    var label = '<i class="hide icon" onclick="toggleHeader()"></i><span class="ui image label"><img src="img/person.jpg">' + username + '<div class="detail">' + table + '<i onclick="disconnect()" class="delete icon"></i></div></span>';
    $('#tablestatus').html(label);
    $('.ui.page.dimmer').dimmer('hide');
    Logger.hideSignInLog();
    Logger.hideSignInError();
    $('#topgraph').load('graphs/top.html', function(r,s,x) {
      Blockly.svgResize(workspace);
    });
    $('#bargraph').load('graphs/bar.html');
    $('#bottomgraph').load('graphs/bottom.html');
    $('#rulesendbtn').removeClass('disabled');
    $('#toggledimmer').addClass('disabled');
  },

  signout: function() {
    this.username = '';
    this.table = '';
    $('#tablestatus').html('<span class="ui label">Geen verbinding met een tafel</span>');
    $('#topgraph').html('<p> Wanneer je verbonden bent met een tafel, <br /> zullen de resultaten hier worden weergegeven.</p>');
    $('#bargraph').load('elements/welcomebar.html');
    $('#bottomgraph').html('');
    $('#rulesendbtn').addClass('disabled');
    Blockly.svgResize(workspace);
    $('#toggledimmer').removeClass('disabled');
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
