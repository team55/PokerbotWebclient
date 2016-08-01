
/**
 *  This file folds the SERVER_CORE instance which is the bottom layer to
 *  communicate with the server. This file requires JQUERY.
 */

var CREATE_TABLE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/makeTable.php';
var KILL_TABLE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/killTable.php';
var CONNECT_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/hello.php?tableName=';
var SEND_RULE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/joinTable.php?tableName=';
var TABLE_DATA_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/ObserveTable.php?tableName=';
var TABLE_LIST_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/get_tables.php';
var LEAVE_TABLE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/goodbye.php';

var CONNECT_URL_SUFFIX = '&playerName=';
var SEND_RULE_FIRST_SUFFIX = '&playerName=';
var SEND_RULE_SECOND_SUFFIX = '&description=';

/**
 *  SERVER_CORE instance is the lowest level connection to the server. Every
 *  request to the server should be handled here. It is completely independent
 *  of the user interface but provides callbacks for every scenario. It is the
 *  core API, but should never be called directly. There are other API layers
 *  for this. This layer does not do any desanitizing at all!
 */
var SERVER_CORE = {

  /**
   *  Creates a new table with given name, password and number of seats.
   *  The success, fail and final callbacks will be called in the corresponding
   *  cases.
   *  @param    tablename   The name of the new table.
   *  @param    password    The password of the new table.
   *  @param    seats       The number of seats at the new table.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  createTable: function(tablename, password, seats, options) {
    options = options || {};
    var data = { 'name':tablename, 'password':password, 'nbPlayers':seats};
    $.ajax({ url: CREATE_TABLE_URL, method: 'POST', data: data,
      success: function(result) {
        if ('success' in options && !(options.success === undefined)) options.success(result);
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final' in options && !(options.final === undefined)) options.final();
      }
    });
  },

  /**
   *  Kills the table with the given name in case its password is correct.
   *  The success, fail and final callbacks will be called in the corresponding
   *  cases.
   *  @param    tablename   The name of the table.
   *  @param    password    The password of the table.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  killTable: function(tablename, password, options) {
    options = options || {};
    var data = { 'tableName':tablename, 'password':password };
    $.ajax({ url: KILL_TABLE_URL, method: 'POST', data: data,
      success: function(result) {
        if ('success' in options && !(options.success === undefined)) options.success(result);
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final' in options && !(options.final === undefined)) options.final();
      }
    });
  },

  /**
   *  Connects a user with the given username to the table with the given
   *  tablename if possible. The success, fail and final callbacks will be
   *  called in the corresponding cases.
   *  @param    username    The user that wants to connect.
   *  @param    tablename   The table the user wants to connect to.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  connect: function(username, tablename, options) {
    var destination = CONNECT_URL + tablename + CONNECT_URL_SUFFIX + username;
    $.ajax({ url: destination,
      success: function(result) {
        try {
          var data = $.parseJSON(result);
          if (data['type'] === 'Acknowledge') {
            if ('success' in options && !(options.success === undefined)) options.success(result);
          } else if ('fail' in options && !(options.fail === undefined)) {
            if ('fail' in options && !(options.fail === undefined)) options.fail(data['message']);
          }
        } catch(error) {
          if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        }
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final'in options) options.final();
      }
    });
  },

  /**
   *  Activates a prolog rule for the given user at the given table. The
   *  success, fail and final callbacks will be called in the corresponding
   *  cases.
   *  @param    username    The user that wants to activate a rule.
   *  @param    tablename   The table the user sits at.
   *  @param    rule        The rule to activate for the given user.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  sendRule: function(username, tablename, rule, options) {
    options = options || {};
    var destination = SEND_RULE_URL + tablename;
    destination += SEND_RULE_FIRST_SUFFIX + username + SEND_RULE_SECOND_SUFFIX;
    destination += encodeURIComponent(rule);
    $.ajax({ url: destination,
      success: function(result) {
        if ('success' in options && !(options.success === undefined)) options.success();
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final' in options && !(options.final === undefined)) options.final();
      }
    });
  },

  /**
   *  Gets the results of that table represented by the given tablename. The
   *  result will be passed to the success callback. The functions fail and
   *  final will be called in the corresponding cases.
   *  @param    tablename   The table to get the data from.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  getTableData: function(tablename, options) {
    options = options || {};
    var destination = TABLE_DATA_URL + tablename;
    $.ajax({ url: destination,
      success: function(result) {
        try {
          var data = $.parseJSON(result);
          if ('success' in options && !(options.success === undefined)) options.success(result);
        } catch(error) {
          if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        }
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final' in options && !(options.final === undefined)) options.final();
      }
    });
  },

  /**
   *  Returns the data of all the tables on the server. The success, fail and
   *  final callbacks will be called in the corresponding cases.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  getTableList: function(options) {
    options = options || {};
    $.ajax({ url: TABLE_LIST_URL,
      success: function(result) {
        try {
          var data = $.parseJSON(result);
          if('success' in options && !(options.success === undefined)) options.success(result);
        } catch(error) {
          if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        }
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final' in options && !(options.final === undefined)) options.final();
      }
    });
  },

  /**
   *  Makes a user leave from a table. The success, fail and
   *  final callbacks will be called in the corresponding cases.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  leaveTable: function(username, tablename, options) {
    options = options || {};
    $.ajax({ url: LEAVE_TABLE_URL, method: 'POST', data: {
        tableName: tablename,
        playerName: username
      },
      success: function(result) {
        if ('success' in options && !(options.success === undefined)) options.success();
        if ('final' in options && !(options.final === undefined)) options.final();
      },
      error: function(xhr, error, thrown) {
        if ('fail' in options && !(options.fail === undefined)) options.fail(error);
        if ('final' in options && !(options.final === undefined)) options.final();
      }
    });
  }

};
