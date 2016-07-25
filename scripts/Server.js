
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
   *  @param  tablename   The name of the new table.
   *  @param  password    The password of the new table.
   *  @param  seats       The number of seats at the new table.
   *  @param  success     Callback when succeeded.
   *  @param  fail        Callback when failed.
   *  @param  final       Callback when finished.
   */
  createTable: function(tablename, password, seats, success, fail, final) {
    var ct = SERVER._desanitize(tablename);
    var cp = SERVER._desanitize(password);
    var cs = SERVER._desanitize(seats);
    if (ct === '' || cp === '' || cs === '') {
      console.error('Invalid data to create table');
      if (fail) fail('Invalid data to create table');
      if (final) final();
    } else {
      SERVER_CORE.createTable(ct, cp, cs, success, fail, final);
    }
  },

  /**
   *  Kills the table with the given name in case its password is correct.
   *  The success, fail and final callbacks will be called in the corresponding
   *  cases.
   *  @param  tablename   The name of the table.
   *  @param  password    The password of the table.
   *  @param  success     Callback when succeeded.
   *  @param  fail        Callback when failed.
   *  @param  final       Callback when finished.
   */
  killTable: function(tablename, password, success, fail, final) {
    var ct = SERVER._desanitize(tablename);
    var cp = SERVER._desanitize(password);
    if (ct === '' || cp === '') {
      console.error('Invalid data to kill table');
      if (fail) fail('Invalid data to kill table');
      if (final) final();
    } else {
      SERVER_CORE.killTable(ct, cp, success, fail, final);
    }
  },

  /**
   *  Gets the results of that table represented by the given tablename. The
   *  result will be passed to the success callback. The functions fail and
   *  final will be called in the corresponding cases.
   *  @param  tablename   The table to get the data from.
   *  @param  success     Callback when succeeded.
   *  @param  fail        Callback when failed.
   *  @param  final       Callback when finished.
   */
  getTableData: function(tablename, success, fail, final) {
    var ct = SERVER._desanitize(tablename);
    if (ct === '') {
      console.error('Invalid data to fetch data from');
      if (fail) fail('Invalid data to fetch data from');
      if (final) final();
    } else {
      SERVER_CORE.getTableData(ct, success, fail, final);
    }
  },

  /**
   *  Returns the data of all the tables on the server. The success, fail and
   *  final callbacks will be called in the corresponding cases.
   *  @param  success     Callback when succeeded.
   *  @param  fail        Callback when failed.
   *  @param  final       Callback when finished.
   */
  getTableList: function(success, fail, final) {
    SERVER_CORE.getTableList(success, fail, final);
  },

  _desanitize: function(str) {
    return str.replace(/\W|_/g, '');
  }

}
