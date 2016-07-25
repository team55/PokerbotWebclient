
/**
 *  This file holds the CLIENT instance to handle all client side actions.
 *  Use the instance in this file for ALL ACTIONS (API). If the action you
 *  would like to do does not have an interface here, you did something wrong.
 */

const USERNAME_MAX_LENGTH = 12;
const USERNAME_MAX_SERVER_LENGTH = 20;
const USERNAME_SUFFIX = "...";

const DEFAULT_USERNAME_VALUE = undefined;
const DEFAULT_TABLENAME_VALUE = undefined;

/**
 *  This client instance should be globally available and provides an interface
 *  to communicate with the signed in user. The clients holds information about
 *  the connection like username and tablename and will communicate with the
 *  backend via the SERVER instance.
 */
var CLIENT = {

  // The username & tablename should never be called via the raw variable. There
  // is a lot of formatting going on so please call the corresponding functions.
  _username: DEFAULT_USERNAME_VALUE,
  _tablenname: DEFAULT_TABLENAME_VALUE,

  /**
   *  Returns a string representation of the username as it is represented on
   *  the server. For now, the string representation will be the same string
   *  but with its length capped on USERNAME_MAX_SERVER_LENGTH characters.
   *  @return   The username as found on the Server.
   */
  serverUsername: function() {
    if (CLIENT._username.length > USERNAME_MAX_SERVER_LENGTH)
      return CLIENT._username.substring(0, USERNAME_MAX_SERVER_LENGTH);
    return CLIENT._username;
  },

  /**
   *  Returns a abbreviated string representation of the username of the current
   *  active user. In case the username is <= USERNAME_MAX_LENGTH, the
   *  abbreviated username stays the same. Otherwise it will be capped on
   *  USERNAME_MAX_LENGTH - USERNAME_SUFFIX.length, followed by the
   *  USERNAME_SUFFIX variable.
   *  @return   The abbreviated username.
   */
  abbreviatedUsername: function() {
    if (CLIENT._username.length <= USERNAME_MAX_LENGTH)
      return CLIENT._username;
    var baseSize = USERNAME_MAX_LENGTH - USERNAME_SUFFIX.length;
    return CLIENT._username.substring(0, baseSize) + USERNAME_SUFFIX;
  },

  /**
   *  Returns the raw string representation of the username. The string should
   *  already be desanitized in the sign in preparation process.
   *  @return   The raw username.
   */
  rawUsername: function() {
    return CLIENT._username;
  },

  /**
   *  Returns the raw string representation of the tablename. The string should
   *  already be desanitized in the sign in preparation process.
   *  @return   The raw tablename.
   */
  rawTablename: function() {
    return CLIENT._tablename;
  },

  /**
   *  Checks whether or not the current CLIENT instance is connected to a table
   *  or not. It checks whether or not a username and tablename are set.
   *  @return   True is the user is connected to a table.
   */
  isConnected: function() {
    return CLIENT._username != DEFAULT_USERNAME_VALUE &&
            CLIENT._tablename != DEFAULT_TABLENAME_VALUE;
  },

  /**
   *  Connects the user with given username to the table with given tablename
   *  after desanitizing. Success and fail callbacks can be provided and
   *  will be called accordingly. The final callback (if provided) will be
   *  called whenever the action ends (after success or failure).
   *  TODO: Call the SERVER instance when the class is refactored.
   */
  connect: function(username, table, success, fail, final) {
    CLIENT._username = CLIENT._desanitize(username);
    CLIENT._tablename = CLIENT._desanitize(tablename);
    CLIENT._initInterfaceOnConnect();
    if (success) success();
    if (fail) fail();
  },

  /**
   *  Disconnects the user from the table (if connected). Success and fail
   *  callbacks can be provided and will be called accordingly. The final
   *  callback (if provided) will be called whenever the action ends (after
   *  success or failure).
   *  TODO: Call the SERVER instance when the class is refactored.
   */
  disconnect: function(success, fail, final) {
    if (CLIENT.isConnected()) {
      this._username = DEFAULT_USERNAME_VALUE;
      this._tablename = DEFAULT_TABLENAME_VALUE;
      CLIENT._restoreInterfaceOnDisconnect();
    } else {
      if (success) success();
      if (final) final();
    }
  },

  _initInterfaceOnConnect: function() {
    CLIENT._restoreSignInForm();
    CLIENT._initHeader();
    CLIENT._makeTransition();
    CLIENT._initGraphs();
    CLIENT._initButtons();
    CLIENT._resizeWorkspace();
  },
  _restoreInterfaceOnDisconnect: function() {
    CLIENT._resetTableStatus();
    CLIENT._resetGraphs();
    CLIENT._resetHeader();
    CLIENT._resetButtons();
    CLIENT._resizeWorkspace();
  },
  _restoreSignInForm: function() {
    $('#login').hide();
    $('#username').val('');
    $('#tablename').val('');
  },
  _initHeader: function() {
    var label = '\
      <i id="toggleheaderbtn" class="unhide icon" onclick="toggleHeader()"></i>\
      <span class="ui image label">\
        <img src="img/person.jpg">' + this.formattedUsername() + '\
        <div class="detail">' + table + '\
          <i onclick="disconnect()" class="delete icon"></i>\
        </div>\
      </span>';
    $('#tablestatus').html(label);
  },
  _makeTransition: function() {
    $('.ui.page.dimmer').dimmer('hide');
    Logger.hideSignInLog();
    Logger.hideSignInError();
  },
  _initGraphs: function() {
    $('#topgraph').load('graphs/top.html', function(r,s,x) {
      $('#bargraph').load('graphs/bar.html', function(r,s,x) {
        $('#bottomgraph').addClass('hideme');
        $('#bottomgraph').load('graphs/bottom.html', function(r,s,x) {
          Blockly.svgResize(workspace);
        });
      });
    });
  },
  _initButtons: function() {
    $('#rulesendbtn').removeClass('disabled');
    $('#detailedviewbtn').removeClass('hideme');
    $('#toggledimmer').addClass('disabled');
  },
  _resizeWorkspace: function() {
    Blockly.svgResize(workspace);
  },
  _resetTableStatus: function() {
    var label = '<span class="ui label">Geen verbinding met een tafel</span>';
    $('#tablestatus').html(label);
  },
  _resetGraphs: function() {
    $('#topgraph').html('');
    $('#bottomgraph').html('');
    $('#bargraph').load('elements/welcomebar.html');
  },
  _resetButtons: function() {
    $('#rulesendbtn').addClass('disabled');
    $('#toggledimmer').removeClass('disabled');
    $('#detailedviewbtn').addClass('hideme');
  },
  _resetHeader: function() {
    if ($('#header').hasClass('hideme'))
      toggleHeader();
  },
  _desanitize: function(str) {
    return str.replace(/\W|_/g, '');
  }

}
