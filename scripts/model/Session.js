
/**
 *  This file holds the SESSION instance which is the interface for the whole
 *  application for everything that is related to the client (i.e. connect,
 *  disconnect, sendRule, etc).
 */

var USERNAME_MAX_LENGTH = 10;
var USERNAME_MAX_SERVER_LENGTH = 20;
var USERNAME_SUFFIX = "...";

var DEFAULT_USERNAME_VALUE = undefined;
var DEFAULT_TABLENAME_VALUE = undefined;

/**
 *  SESSION instance is the one that holds all the information about the current
 *  session (i.e. user info, table info, etc.). It communicates with the
 *  SERVER_CORE instance to connect to the server. Make sure you NEVER
 *  communicate directly to the SERVER_CORE instance, but always through the
 *  SESSION instance. This layer makes sure that the input will be desanitized
 *  etc.
 */
var SESSION = {

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
  getServerUsername: function() {
    if (SESSION._username.length > USERNAME_MAX_SERVER_LENGTH)
      return SESSION._username.substring(0, USERNAME_MAX_SERVER_LENGTH);
    return SESSION._username;
  },

  /**
   *  Returns a abbreviated string representation of the username of the current
   *  active user. In case the username is <= USERNAME_MAX_LENGTH, the
   *  abbreviated username stays the same. Otherwise it will be capped on
   *  USERNAME_MAX_LENGTH - USERNAME_SUFFIX.length, followed by the
   *  USERNAME_SUFFIX variable.
   *  @return   The abbreviated username.
   */
  getAbbreviatedUsername: function() {
    if (SESSION._username.length <= USERNAME_MAX_LENGTH)
      return SESSION._username;
    var baseSize = USERNAME_MAX_LENGTH - USERNAME_SUFFIX.length;
    return SESSION._username.substring(0, baseSize) + USERNAME_SUFFIX;
  },

  /**
   *  Returns the raw string representation of the username. The string should
   *  already be desanitized in the connection process.
   *  @return   The raw username.
   */
  getRawUsername: function() {
    return SESSION._username;
  },

  /**
   *  Returns the raw string representation of the tablename. The string should
   *  already be desanitized in the connection process.
   *  @return   The raw tablename.
   */
  getRawTablename: function() {
    return SESSION._tablename;
  },

  /**
   *  Checks whether or not the current SESSION instance is connected to a table
   *  or not. It checks whether or not a username and tablename are set.
   *  @return   True is the user is connected to a table.
   */
  isConnected: function() {
    return SESSION._username != DEFAULT_USERNAME_VALUE &&
            SESSION._tablename != DEFAULT_TABLENAME_VALUE;
  },

  /**
   *  Connects the user with given username to the table with the given
   *  tablename. The functions success, fail and final will be called in their
   *  corresponding cases.
   *  @param    username    The user that wants to connect.
   *  @param    tablename   The table the user wants to connect to.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  connect: function(username, tablename, options) {
    options = options || {};
    var cleanUsername = SESSION._desanitize(username);
    var cleanTablename = SESSION._desanitize(tablename);
    if (cleanUsername === '' || cleanTablename === '') {
      if ('fail' in options && !(options.fail === undefined)) options.fail('Ongeldige data ingevoerd.');
      if ('final' in options && !(options.final === undefined)) options.final();
    } else {
      SERVER_CORE.connect(cleanUsername, cleanTablename, {
        success: function() {
          SESSION._username = cleanUsername;
          SESSION._tablename = cleanTablename;
          if ('success' in options && !(options.success === undefined)) options.success();
        },
        fail: options.fail,
        final: options.final
      });
    }
  },

  /**
   *  Checker to see if this is valid data to connect.
   */
  isValidDataToConnect: function(username, tablename) {
    var cleanUsername = SESSION._desanitize(username);
    var cleanTablename = SESSION._desanitize(tablename);
    return !(cleanUsername === '' || cleanTablename === '');
  },

  /**
   *  Disconnects the user if there is one. The functions success, fail and
   *  final will be called in their corresponding cases.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  disconnect: function(options) {
    if (!SESSION.isConnected()) {
      if ('fail' in options && !(options.fail === undefined)) options.fail('Not connected');
    } else {
      SERVER_CORE.leaveTable(SESSION.getServerUsername(), SESSION.getRawTablename(), {
        success: function() {
          SESSION._username = DEFAULT_USERNAME_VALUE;
          SESSION._tablename = DEFAULT_TABLENAME_VALUE;
          if ('success' in options && !(options.success === undefined)) options.success();
          if ('final' in options && !(options.final === undefined)) options.final();
        },
        error: function(error) {
          if ('fail' in options && !(options.fail === undefined)) options.fail(error);
          if ('final' in options && !(options.final === undefined)) options.final();
        }
      });
    }
  },

  /**
   *  Sends the given rule to the connected user. If no user is connected, the
   *  function will fail. The success, fail and final functions will be called
   *  in their corresponding cases.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  sendRule: function(rule, options) {
    if (!SESSION.isConnected()) {
      if ('fail' in options && !(options.fail === undefined)) options.fail('No user connected to send rule to');
      if ('final' in options && !(options.final === undefined)) options.final();
    } else {
      SERVER_CORE.sendRule(SESSION.getServerUsername(), SESSION.getRawTablename(), rule, {
        success: function() {
          if ('success' in options && !(options.success === undefined)) options.success();
        },
        fail: options.fail,
        final: options.final
      });
    }
  },

  _desanitize: function(str) {
    if (str === undefined) return str;
    return str.replace(/\W|_/g, '');
  }

};
