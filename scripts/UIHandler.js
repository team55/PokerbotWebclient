
// Needs to access var workspace

var UIHANDLER = {

  updateViewsAfterConnectionEstablished: function() {
    UIHANDLER.updateHeaderAfterConnectionEstablished();
    UIHANDLER.updateButtonsAfterConnectionEstablished();
    UIHANDLER.includeGraphsAfterConnectionEstablished();
    UIHANDLER.activateSendRuleButton();
    UIHANDLER.makeConnectedTransition();
    UIHANDLER.clearConnectionForm();
    UIHANDLER.resizeWorkspace();
    UIHANDLER.hideSignInError();
    UIHANDLER.hideCreateTableLogAndError();
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
        //$('#bottomgraph').addClass('hideme');
        UIHANDLER.includeBottomGraph(function() {
          UIHANDLER.resizeWorkspace();
          UIHANDLER.hideDetailedView();
          if (callback) callback();
        });
      });
    });
  },

  includeTopGraph: function(callback) {
    $('#topgraph').load('elements/top.html', callback);
  },

  includeBarGraph: function(callback) {
    $('#bargraph').load('elements/bar.html', callback);
  },

  includeBottomGraph: function(callback) {
    $('#bottomgraph').load('elements/bottom.html', callback);
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

  /*
   *  REFRESH TABLE LIST.
   */

  startTableListRefreshing: function() {
    $('#refresh-tables-btn').addClass('loading');
  },

  stopTableListRefreshing: function() {
    $('#refresh-tables-btn').removeClass('loading');
  },

  updateTableListSelect: function(result) {
    try {
      var data = $.parseJSON(result);
      var converted = {};
      for(var i = 0; i < data['tables'].length; i++)
        converted[data['tables'][i]['name']] = data['tables'][i]['name'];
      $('#tablename').html($('<option></option>').attr('value','').text('Kies een tafel'));
      $.each(converted, function(key, value) {
        $('#tablename').append($('<option></option>').attr('value', key).text(value));
      });
    } catch(error) {
      console.error(error);
    }
  },

  /*
   *  CONNECT TO TABLE.
   */

  startConnectToTable: function() {
    $('#connect-btn').addClass('loading');
  },

  stopConnectToTable: function() {
    $('#connect-btn').removeClass('loading');
  },

  /*
   *  CREATE A TABLE.
   */

  startCreateTable: function() {
    $('#create-table-btn').addClass('loading');
  },

  stopCreateTable: function() {
    $('#create-table-btn').removeClass('loading');
  },

  /*
   *  CREATE AND CONNECT TO A TABLE.
   */

  startCreateAndConnectToTable: function() {
    $('#create-table-and-connect-btn').addClass('loading');
  },

  stopCreateAndConnectToTable: function() {
    $('#create-table-and-connect-btn').removeClass('loading');
  },

  /*
   *  ERROR / LOG DISPLAYS.
   */

   showSignInError: function(error) {
     $('#sign-in-error').html(error);
     $('#sign-in-error').show();
   },

   hideSignInError: function() {
     $('#sign-in-error').hide();
   },

   showCreateTableLog: function(str) {
     $('#create-table-log').html(str);
     $('#create-table-log').show();
   },

   hideCreatTableLog: function() {
     $('#create-table-log').hide();
   },

   showCreateTableError: function(error) {
     $('#create-table-error').html(error);
     $('#create-table-error').show();
   },

   hideCreateTableError: function() {
     $('#create-table-error').hide();
   },

   hideCreateTableLogAndError: function() {
     UIHANDLER.hideCreatTableLog();
     UIHANDLER.hideCreateTableError();
   },

   /**
    * CLEARING FORMS.
    */

   clearCreateTableForm: function() {
     $('#table-create-tablename').val('');
     $('#table-password').val('');
     $('#table-players').val('');
   },

   clearCreateTableAndConnectForm: function() {
     $('#table-create-username').val('');
     UIHANDLER.clearCreateTableForm();
   },

   /*
    * DISCONNECT
    */
   showDisconnectModal: function() {
     $('#disconnectmodal').modal('hide');
     $('#disconnectmodal').modal('show');
   },

   backHome: function() {
     UIHANDLER.resetTableStatus();
     UIHANDLER.resetGraphs();
     UIHANDLER.resetButtons();
     UIHANDLER.resetHeader();
     UIHANDLER.disableFullscreenWorkspace();
     UIHANDLER.disableSendRuleButton();
     UIHANDLER.resizeWorkspace();
   },

   resetTableStatus: function() {
     var label = '<span class="ui label">Geen verbinding met een tafel</span>';
     $('#table-status').html(label);
   },

   resetGraphs: function() {
     $('#topgraph').html('');
     $('#bottomgraph').html('');
     $('#bargraph').load('elements/welcomebar.html');
   },

   resetButtons: function() {
     $('#rulesendbtn').addClass('disabled');
     $('#toggledimmer').removeClass('disabled');
     $('#detailedviewbtn').addClass('hideme');
   },

   resetHeader: function() {
     if ($('#header').hasClass('hideme'))
       toggleHeader();
   },

   finishCreateTableAndConnect: function() {
     UIHANDLER.clearCreateTableAndConnectForm();
     UIHANDLER.updateViewsAfterConnectionEstablished();
   },




  /****************************

          SENDING RULES

   ****************************/

  activateSendRuleButton: function() {
    $('#rule-send-btn').removeClass('disabled');
  },

  disableSendRuleButton: function() {
    $('#rule-send-btn').addClass('disabled');
  },


  startSendRule: function() {
    $('#rule-send-btn').addClass('loading');
  },

  showRuleSentErrorMessage() {
    $('#send-status').show();
  },

  hideRuleSentErrorMessage() {
    $('#send-status').hide();
  },

  stopSendRule: function() {
    UIHANDLER.hideRuleSentErrorMessage();
    $('#rule-send-btn').removeClass('loading');
  },


  toggleHeader: function() {
    if ($('#header').css('display') == 'none') {
      $('#header').show();
      $('#toggledimmer').show();
      $('#toggleheaderbtn').removeClass('unhide');
      $('#toggleheaderbtn').addClass('hide');
    } else {
      $('#header').hide();
      $('#toggledimmer').hide();
      $('#toggleheaderbtn').removeClass('hide');
      $('#toggleheaderbtn').addClass('unhide');
    }
    UIHANDLER.resizeWorkspace();
  },



  enableFullscreenWorkspace: function() {
    $('#blocklyDiv').addClass('fullscreen fullscreen-margin');
    $('#blocks-bar').removeClass('eleven wide column');
    $('#blocks-bar').addClass('sixteen wide column');
    $('#bargraph').hide();
    $('#rule-send-btn').addClass('fullscreen-margin');
    $('#resize-btn').html('Verklein');
    UIHANDLER.resizeWorkspace();
  },

  disableFullscreenWorkspace: function() {
    $('#blocklyDiv').removeClass('fullscreen fullscreen-margin');
    $('#blocks-bar').removeClass('sixteen wide column');
    $('#blocks-bar').addClass('eleven wide column');
    $('#bargraph').show();
    try { fetchDataForBarCharts(); } catch(error) {}
    $('#rule-send-btn').removeClass('fullscreen-margin');
    $('#resize-btn').html('Vergroot');
    UIHANDLER.resizeWorkspace();
  },



  toggleFullscreenWorkspace: function() {
    if (!$('#blocklyDiv').hasClass('fullscreen')) {
      UIHANDLER.enableFullscreenWorkspace();
    } else {
      UIHANDLER.disableFullscreenWorkspace();
    }
  },




  showDetailedView: function() {
    $('#bottomgraph').show();
    try { fetchBottomBarGraphsData(); } catch(error) { console.error(error); }
    $('#detailedviewbtn').html('Verberg details');
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
  },

  hideDetailedView: function() {
    $('html, body').animate({scrollTop:0}, 'slow', function() {
      $('#bottomgraph').hide();
      $('#detailedviewbtn').html('Toon details');
    });
  },





  toggleDetailedView: function() {
    if ($('#bottomgraph').css('display') == 'none') {
      UIHANDLER.showDetailedView();
    } else {
      UIHANDLER.hideDetailedView();
    }
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
