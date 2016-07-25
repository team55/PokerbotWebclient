
$('#connect-btn').click(function(e) {
  var username = $('#username').val();
  var tablename = $('#tablename').val();
  SESSION.connect(username, tablename, {
    success: function() {
      UIHANDLER.updateViewsAfterConnectionEstablished();
    },
    fail: function(error) {
      console.error('!!!');
      console.error(error);
    }
  });
});
