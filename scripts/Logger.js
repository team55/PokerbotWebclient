/**
 *  Simple instance to log data on the page. This way some errors that we
 *  REALLY don't like can be shown on the webpage so we will definetely
 *  notice it. There are two different log types (error and log) and three
 *  different log streams (SignIn, CreateTable and Global). Each of these will
 *  log somewhere else. Make sure to call the correct one. If no stream is
 *  provided, the Global stream will be used.
 */

var Logger = {

  /**
   *  Calling this function will result in hiding the view containing
   *  the global logs. This will mostly be done manually by the user.
   */
  hideGlobalLog: function() {
    $('#globalLog').hide();
    $('#globalLog').html('');
  },

  /**
   *  Calling this function will result in hiding the view containing
   *  the global errors. This will mostly be done manually by the user.
   */
  hideGlobalError: function() {
    $('#globalError').hide();
    $('#gloablError').html('');
  },

  /**
   *  Calling this function will result in hiding the view containing
   *  the sign in logs. This will mostly be done automatically when needed.
   */
  hideSignInLog: function() {
    $('#signInLog').hide();
    $('#signInLog').html('');
  },

  /**
   *  Calling this function will result in hiding the view containing
   *  the sign in errors. This will mostly be done automatically when needed.
   */
  hideSignInError: function() {
    $('#signInError').hide();
    $('#signInError').html('');
  },

  /**
   *  Calling this function will result in hiding the view containing
   *  the create table logs. This will mostly be done automatically when needed.
   */
  hideCreateTableLog: function() {
    $('#createTableLog').hide();
    $('#createTableLog').html('');
  },

  /**
   *  Calling this function will result in hiding the view containing
   *  the create table errors. This will mostly be done automatically when needed.
   */
  hideCreateTableError: function() {
    $('#createTableError').hide();
    $('#createTableError').html('');
  },

  /**
   *  Returns the id of the div to log to when the stream name is given.
   */
  logIdentifierForStream: function(stream) {
    if (stream === "SIGNIN") { return "#signInLog"; }
    else if (stream === "CREATETABLE") { return "#createTableLog"; }
    else { return "#globalLog"; }
  },

  /**
   *  Returns the id of the div to write errors to when the stream name is given.
   */
  errorIdentifierForStream: function(stream) {
    if (stream === "SIGNIN") { return "#signInError"; }
    else if (stream === "CREATETABLE") { return "#createTableError"; }
    else { return "#globalError"; }
  },

  /**
   *  Returns the content suffix based on the steam name. This will mostly be
   *  be some general information like 'notify system administrator' or a
   *  button to hide the log.
   */
  logContentSuffixForStream: function(stream) {
    if (stream === "SIGNIN" || stream === "CREATETABLE") { return ""; }
    return '<br /><button class="mini ui button" onclick="Logger.hideGlobalLog()">Alright!</button>';
  },

  /**
   *  Returns the content suffix based on the steam name. This will mostly be
   *  be some general information like 'notify system administrator' or a
   *  button to hide the error.
   */
  errorContentSuffixForStream: function(stream) {
    if (!stream === "SIGNIN" || stream === "CREATETABLE") { return ""; }
    return '<br /><button class="mini ui button" onclick="Logger.hideGlobalError()">Alright!</button>';
  },

  /**
   *  Logs the given data to the given stream. No other views will be
   *  affected by calling this function (so the corresponding error view won't
   *  be hidden).
   */
  log: function(data, stream) {
    var logIdentifier = this.logIdentifierForStream(stream);
    $(logIdentifier).html(data + this.logContentSuffixForStream(stream));
    $(logIdentifier).show();
  },

  /**
   *  Logs the given error to the given stream. No other views will be
   *  affected by calling this function (so the corresponding log view won't
   *  be hidden).
   */
  error: function(data, stream) {
    var errorIdentifier = this.errorIdentifierForStream(stream);
    $(errorIdentifier).html(data + this.errorContentSuffixForStream(stream));
    $(errorIdentifier).show();
  }

}
