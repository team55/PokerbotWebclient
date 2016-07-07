
/**
 *  Simple instance to log data on the page. This way some errors that we
 *  REALLY don't like can be shown on the webpage so we will definetely
 *  notice it. Whenever it pops up, notify the system administrator.
 *  Make sure to change LOGIDENTIFIER to the id of the div.
 */
var LOGIDENTIFIER = "#logdiv";
var Logger = {

  log: function(data) {
    var ext = '<br />Please tell this to the system administrator!';
    var btn = '<br /><button onclick="Logger.hide()">Yeah sure<button>';
    $(LOGIDENTIFIER).html(data + btn);
    $(LOGIDENTIFIER).show();
  }

  hide: function() {
    $(LOGIDENTIFIER).hide();
    $(LOGIDENTIFIER).html('');
  }

}
