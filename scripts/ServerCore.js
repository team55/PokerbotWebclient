
/**
 *  This file folds the SERVER_CORE instance which is the bottom layer to
 *  communicate with the server. This file requires JQUERY.
 */

const CREATE_TABLE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/makeTable.php';
const KILL_TABLE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/killTable.php';
const CONNECT_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/hello.php?tableName=';
const SEND_RULE_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/joinTable.php?tableName=';
const TABLE_DATA_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/ObserveTable.php?tableName=';
const TABLE_LIST_URL = 'http://bear.cs.kuleuven.be/pokerdemo/server/get_tables.php';

const CONNECT_URL_SUFFIX = '&playerName=';
const SEND_RULE_FIRST_SUFFIX = '&playerName=';
const SEND_RULE_SECOND_SUFFIX = '&description=';

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
    console.log('Sending request to create table with data ' + data);
    $.ajax({ url: CREATE_TABLE_URL, method: 'POST', data: data,
      success: function(result) {
        console.log('Successfully created table');
        if ('success' in options && options.success != undefined) options.success(result);
        if ('final' in options && options.final != undefined) options.final();
      },
      error: function(error) {
        console.error('Unable to create table');
        if ('fail' in options && options.fail != undefined) options.fail(error);
        if ('final' in options && options.final != undefined) options.final();
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
    console.log('Sending request to kill table with data ' + data);
    $.ajax({ url: KILL_TABLE_URL, method: 'POST', data: data,
      success: function(result) {
        console.log('Successfully killed table');
        if ('success' in options && options.success != undefined) options.success(result);
        if ('final' in options && options.final != undefined) options.final();
      },
      error: function(error) {
        console.error('Unable to kill table');
        if ('fail' in options && options.fail != undefined) options.fail(error);
        if ('final' in options && options.final != undefined) options.final();
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
    console.log('Sending request to connect ' + destination);
    $.ajax({ url: destination,
      success: function(result) {
        try {
          var data = $.parseJSON(result);
          if (data['type'] === 'Acknowledge') {
            console.log('Connected successfully');
            if ('success' in options && options.success != undefined) options.success(data);
          } else if (fail) {
            console.error('Unable to connect');
            if ('fail' in options && options.fail != undefined) options.fail(data['message']);
          }
        } catch(error) {
          if ('fail' in options && options.fail != undefined) options.fail();
        }
        console.log(options);
        if ('final' in options && options.final != undefined) options.final();
      },
      error: function(error) {
        console.error('Unable to send connect request ' + error);
        if ('fail' in options && options.fail != undefined) options.fail();
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
    console.log('Sending request for rule ' + destination);
    $.ajax({ url: destination,
      success: function(result) {
        console.log('Sent rule!');
        if ('success' in options && options.success != undefined) options.success();
        if ('final' in options && options.final != undefined) options.final();
      },
      error: function(error) {
        console.error('Unable to send rule!');
        if ('fail' in options && options.fail != undefined) options.fail(error);
        if ('final' in options && options.final != undefined) options.final();
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
    console.log('Sending request for table data ' + destination);
    $.ajax({ url: destination,
      success: function(result) {
        try {
          var data = $.parseJSON(result);
          console.log('Received valid table data');
          if ('success' in options && options.success != undefined) options.success(data);
        } catch(error) {
          console.error('Received invalid table data' + error);
          if ('fail' in options && options.fail != undefined) options.fail(error);
        }
        if ('final' in options && options.final != undefined) options.final();
      },
      error: function(error) {
        console.error('Unable to get table data ' + error);
        if ('fail' in options && options.fail != undefined) options.fail(error);
        if ('final' in options && options.final != undefined) options.final();
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
    console.log('Sending request to get all tables');
    $.ajax({ url: TABLE_LIST_URL,
      success: function(result) {
        try {
          var data = $.parseJSON(result);
          console.log('Received table list');
          if('success' in options && options.success != undefined) options.success(data);
        } catch(error) {
          console.error('Received invalid table list ' + error);
          if ('fail' in options && options.fail != undefined) options.fail(error);
        }
        if ('final' in options && options.final != undefined) options.final();
      },
      error: function(error) {
        console.error('Unable to receive table list');
        if ('fail' in options && options.fail != undefined) options.fail(error);
        if ('final' in options && options.final != undefined) options.final();
      }
    });
  }

};
