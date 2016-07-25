
var UI_HANDLER = {

  displayCreatedTableInfo: function() {
      Logger.hideCreateTableError();
      Logger.log('Tafel "' + table + '" aangemaakt!<br />Je kan er nu aan plaatsnemen.', 'CREATETABLE');


  },

  showCreateTableError: function() {
    Logger.error('Er is een probleem opgetreden...', 'CREATETABLE');

  },

  prepareSendRule: function() {
    $('#rulesendbtn').addClass('disabled');

  },

  onSuccessSendRule: function() {
      $('#sendstatuspusher').hide();
      $('#sendstatus').transition('swing left');
      window.setTimeout(function() {
        $('#sendstatus').transition('swing left', function() {
          $('#sendstatuspusher').show();
          $('#rulesendbtn').removeClass('disabled');
        });
      }, 3000);

  },

  sendRuleFail: function() {

      $('#rulesendbtn').removeClass('disabled');
  }

}
