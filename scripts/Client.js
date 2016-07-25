
/**
 *  Instance to store client side actions like showing and hiding divs.
 *  The client instance also stores a username and table when the user
 *  is connected to a table.
 */

const USERNAME_MAX_LENGTH = 12;
const USERNAME_MAX_SERVER_LENGTH = 20;
const USERNAME_SUFFIX = '...';

var Client = {

  username: "",
  table: "",
  showprolog: false,

  serverUsername: function() {
    if (this.username.length > USERNAME_MAX_SERVER_LENGTH) {
      return this.username.substring(0, USERNAME_MAX_SERVER_LENGTH);
    } else {
      return this.username;
    }
  },

  formattedUsername: function() {
    if (this.username.length < USERNAME_MAX_LENGTH) {
      return this.username;
    } else {
      var baseSize = USERNAME_MAX_LENGTH - USERNAME_SUFFIX.length;
      return this.username.substring(0, baseSize) + USERNAME_SUFFIX;
    }
  },

  signin: function(username, table, callback) {
    this.username = username;
    this.table = table;
    $('#login').hide();
    $('#username').val('');
    $('#tablename').val('');
    var label = '<i id="toggleheaderbtn" class="unhide icon" onclick="toggleHeader()"></i><span class="ui image label"><img src="img/person.jpg">' + this.formattedUsername() + '<div class="detail">' + table + '<i onclick="disconnect()" class="delete icon"></i></div></span>';
    $('#tablestatus').html(label);
    $('.ui.page.dimmer').dimmer('hide');
    Logger.hideSignInLog();
    Logger.hideSignInError();
    //$('#blocklyDiv').height('725px');
    $('#topgraph').load('graphs/top.html', function(r,s,x) {
      Blockly.svgResize(workspace);
    });
    $('#bargraph').load('graphs/bar.html');
    $('#bottomgraph').load('graphs/bottom.html');
    $('#rulesendbtn').removeClass('disabled');
    $('#toggledimmer').addClass('disabled');
    $('#detailedviewbtn').removeClass('hideme');
    Blockly.svgResize(workspace);
    if (callback) callback();
  },

  signout: function() {
    this.username = '';
    this.table = '';
    $('#tablestatus').html('<span class="ui label">Geen verbinding met een tafel</span>');
    $('#topgraph').html('');
    $('#bargraph').load('elements/welcomebar.html');
    $('#bottomgraph').html('');
    $('#rulesendbtn').addClass('disabled');
    //$('#blocklyDiv').height('500px');
    $('#toggledimmer').removeClass('disabled');
    $('#detailedviewbtn').addClass('hideme');
    if ($('#header').hasClass('hideme')) {
      toggleHeader();
    }
    Blockly.svgResize(workspace);
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
