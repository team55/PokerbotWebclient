
/**
 *  Simple instance to log data on the page. This way some errors that we
 *  REALLY don't like can be shown on the webpage so we will definetely
 *  notice it. Whenever it pops up, notify the system administrator.
 *  Make sure to change LOGIDENTIFIER to the id of the div.
 */
var LOGIDENTIFIER = "#logdiv";
var ERRIDENTIFIER = "#errdiv"
var Logger = {

  log: function(data) {
    var btn = '<br /><button class="mini ui button" onclick="Logger.hideLog()">Alright!</button>';
    $(LOGIDENTIFIER).html(data + btn);
    $(LOGIDENTIFIER).show();
  },

  error: function(data) {
    var btn = '<br /><button class="mini ui button" onclick="Logger.hideError()">Hmmm... ok</button>';
    $(ERRIDENTIFIER).html(data + btn);
    $(ERRIDENTIFIER).show();
  },

  hideError: function() {
    $(ERRIDENTIFIER).hide();
    $(ERRIDENTIFIER).html('');
  },

  hideLog: function() {
    $(LOGIDENTIFIER).hide();
    $(LOGIDENTIFIER).html('');
  }

}
