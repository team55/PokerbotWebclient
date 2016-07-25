
// Needs to access var workspace

var UIHANDLER = {

  updateViewsAfterConnectionEstablished: function() {
    LOGGER.trace('UIHANDLER.updateViewsAfterConnectionEstablished() called.');
    UIHANDLER.updateHeaderAfterConnectionEstablished();
    UIHANDLER.updateButtonsAfterConnectionEstablished();
    UIHANDLER.includeGraphsAfterConnectionEstablished();
    UIHANDLER.makeConnectedTransition();
    UIHANDLER.clearConnectionForm();
    UIHANDLER.resizeWorkspace();
  },

  updateHeaderAfterConnectionEstablished: function() {
    LOGGER.trace('UIHANDLER.updateHeaderAfterConnectionEstablished() called.');
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
    LOGGER.trace('UIHANDLER.updateButtonsAfterConnectionEstablished() called.');
    $('#toggledimmer').addClass('disabled');
    $('#rulesendbtn').removeClass('disabled');
    $('#detailedviewbtn').removeClass('hideme');
  },

  includeGraphsAfterConnectionEstablished: function(callback) {
    LOGGER.trace('UIHANDLER.includeGraphsAfterConnectionEstablished() called.');
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
    LOGGER.trace('UIHANDLER.includeTopGraph() called.');
    $('#topgraph').load('graphs/top.html', callback);
  },

  includeBarGraph: function(callback) {
    LOGGER.trace('UIHANDLER.includeBarGraph() called.');
    $('#bargraph').load('graphs/bar.html', callback);
  },

  includeBottomGraph: function(callback) {
    LOGGER.trace('UIHANDLER.includeBottomGraph() called.');
    $('#bottomgraph').load('graphs/bottom.html', callback);
  },

  makeConnectedTransition: function() {
    LOGGER.trace('UIHANDLER.makeConnectedTransition() called.');
    $('.ui.page.dimmer').dimmer('hide');
    // TODO: Remove logger and replace with JQUERY
    Logger.hideSignInLog();
    Logger.hideSignInError();
  },

  clearConnectionForm: function() {
    LOGGER.trace('UIHANDLER.clearConnectionForm() called.');
    $('#username').val('');
  },

  resizeWorkspace: function() {
    LOGGER.trace('UIHANDLER.resizeWorkspace() called.');
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
