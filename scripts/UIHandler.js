
// Needs to access var workspace

var UIHANDLER = {

  updateViewsAfterConnectionEstablished: function() {
    UIHANDLER.updateHeaderAfterConnectionEstablished();
    UIHANDLER.updateButtonsAfterConnectionEstablished();
    UIHANDLER.includeGraphsAfterConnectionEstablished();
    UIHANDLER.makeConnectedTransition();
    UIHANDLER.clearConnectionForm();
    UIHANDLER.resizeWorkspace();
  },

  updateHeaderAfterConnectionEstablished: function() {
    var label = '\
      <i class="unhide icon" onclick="toggleHeader()"></i>\
      <span class="ui image label">\
        <img src="img/person.jpg">' + SESSION.getAbbreviatedUsername() + '\
        <div class="detail">' + SESSION.getRawTablename() + '\
          <i onclick="requestDisconnect()" class="delete icon"></i>\
        </div>\
      </span>';
    $('#table-status').html(label);
  },

  updateButtonsAfterConnectionEstablished: function() {
    $('#toggledimmer').addClass('disabled');
    $('#rulesendbtn').removeClass('disabled');
    $('#detailedviewbtn').removeClass('hideme');
  },

  includeGraphsAfterConnectionEstablished: function(callback) {
    UIHANDLER.includeTopGraph(function() {
      UIHANDLER.includeBarGraph(function() {
        $('#bottomgraph').addClass('hideme');
        UIHANDLER.includeBottomGraph(function() {
          UIHANDLER.resizeWorkspace();
          callback();
        });
      });
    });
  },

  includeTopGraph: function(callback) {
    $('#topgraph').load('graphs/top.html', callback);
  },

  includeBarGraph: function(callback) {
    $('#bargraph').load('graphs/bar.html', callback);
  },

  includeBottomGraph: function(callback) {
    $('#bottomgraph').load('graphs/bottom.html', callback);
  },

  makeConnectedTransition: function() {
    $('.ui.page.dimmer').dimmer('hide');
    // TODO: Remove logger and replace with JQUERY
    Logger.hideSignInLog();
    Logger.hideSignInError();
  },

  clearConnectionForm: function() {
    $('#username').val('');
  },

  resizeWorkspace: function() {
    Blockly.svgResize(workspace);
  },



























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
