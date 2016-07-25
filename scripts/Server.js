
/**
 *  This file holds the SERVER instance to handle server side communications
 *  that are not dependent on the user (See SESSION for that). It is used as an
 *  interface for the server to create, kill and fetch data of tables that
 *  are running on the server.
 */

/**
 *  This SERVER instance should be globally available and provides an interface
 *  to communicate with the real server. The instance does not hold any data.
 *  This instance, together with the SESSION instance, should be responsible
 *  for all server-side communications. This instance uses SERVER_CORE, but
 *  SERVER_CORE may NEVER be called directly.
 */
var SERVER = {

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
    var ct = SERVER._desanitize(tablename);
    var cp = SERVER._desanitize(password);
    var cs = SERVER._desanitize(seats);
    if (ct === '' || cp === '' || cs === '') {
      console.error('Invalid data to create table');
      if ('fail' in options && !(options.fail === undefined)) options.fail('Invalid data to create table');
      if ('final' in options && !(options.final === undefined)) options.final();
    } else {
      SERVER_CORE.createTable(ct, cp, cs, options);
    }
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
    var ct = SERVER._desanitize(tablename);
    var cp = SERVER._desanitize(password);
    if (ct === '' || cp === '') {
      console.error('Invalid data to kill table');
      if ('fail' in options && !(options.fail === undefined)) options.fail('Invalid data to kill table');
      if ('final' in options && !(options.final === undefined)) options.final();
    } else {
      SERVER_CORE.killTable(ct, cp, options);
    }
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
    var ct = SERVER._desanitize(tablename);
    if (ct === '') {
      console.error('Invalid data to fetch data from');
      if ('fail' in options && !(options.fail === undefined)) options.fail('Invalid data to fetch data from');
      if ('final' in options && !(options.final === undefined)) options.final();
    } else {
      SERVER_CORE.getTableData(ct, options);
    }
  },

  /**
   *  Returns the data of all the tables on the server. The success, fail and
   *  final callbacks will be called in the corresponding cases.
   *  @option   success     Callback when succeeded.
   *  @option   fail        Callback when failed.
   *  @option   final       Callback when finished.
   */
  getTableList: function(options) {
    SERVER_CORE.getTableList(options);
  },

  _desanitize: function(str) {
    return str.replace(/\W|_/g, '');
  }

}
