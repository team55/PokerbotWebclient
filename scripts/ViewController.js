
$('#connect-btn').click(function(e) {
  LOGGER.trace('Clicked connect button.');
  var username = $('#username').val();
  var tablename = $('#tablename').val();
  SESSION.connect(username, tablename, {
    success: function() {
      LOGGER.trace('SESSION.connect() called success()!');
      UIHANDLER.updateViewsAfterConnectionEstablished();
    },
    fail: function(error) {
      console.error('!!!');
      console.error(error);
    }
  });
});

updateTables();
