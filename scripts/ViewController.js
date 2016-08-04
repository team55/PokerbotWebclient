
var workspace;

/******************************************************************************

                                  SIGN IN SECTION

 ******************************************************************************/

// Connects a sequence to the refresh button (to refresh table selection).
var updateTableSelectionList = function() {
  SERVER.getTableList({
    success: UIHANDLER.updateTableListSelect,
    final: UIHANDLER.stopTableListRefreshing,
    fail: function(error) {
      LOGGER.warn('Unable to fetch table list...');
      UIHANDLER.showSignInError('Er is een fout opgetreden.');
    }
  });
};
$('#refresh-tables-btn').click(function(e) {
 UIHANDLER.hideSignInError();
 UIHANDLER.startTableListRefreshing();
 updateTableSelectionList();
});

// Connects a sequence to the sign in button on the left side!
$('#connect-btn').click(function(e) {
  UIHANDLER.hideSignInError();
  UIHANDLER.startConnectToTable();
  SESSION.connect($('#username').val(), $('#tablename').val(), {
    success: UIHANDLER.updateViewsAfterConnectionEstablished,
    final: UIHANDLER.stopConnectToTable,
    fail: function(error) {
      LOGGER.warn('Unable to connect to table...');
      if (error === 'error') error = 'Geen internetverbinding.';
      UIHANDLER.showSignInError(error);
    }
  });
});

// Connects a sequence to the create table button (to only create a table).
$('#create-table-btn').click(function(e) {
  UIHANDLER.hideCreateTableLogAndError();
  UIHANDLER.startCreateTable();
  SERVER.createTable(
    $('#table-create-tablename').val(),
    $('#table-password').val(),
    $('#table-players').val(), {
    success: function(data) {
      updateTableSelectionList();
      var txt ='Create table with name '+$('#table-create-tablename').val()+'.';
      UIHANDLER.showCreateTableLog(txt);
      UIHANDLER.clearCreateTableForm();
    },
    fail: function(error) {
      LOGGER.warn('Unable to create table...');
      if (error === 'error') { error = 'Geen internetverbinding.'; }
      UIHANDLER.showCreateTableError(error);
    },
    final: UIHANDLER.stopCreateTable
  });
});

// Connects a sequence to the create table and connect button.
$('#create-table-and-connect-btn').click(function(e) {
  UIHANDLER.hideCreateTableLogAndError();
  UIHANDLER.startCreateAndConnectToTable();
  var username = $('#table-create-username').val();
  var tablename = $('#table-create-tablename').val();
  if (!SESSION.isValidDataToConnect(username, tablename)) {
    UIHANDLER.showCreateTableError('Ongeldige data opgegeven.');
    UIHANDLER.stopCreateAndConnectToTable();
  } else {
    SERVER.createTable(
      tablename,
      $('#table-password').val(),
      $('#table-players').val(), {
      success: function() {
        updateTableSelectionList();
        SESSION.connect(username, tablename, {
          success: UIHANDLER.finishCreateTableAndConnect,
          final: UIHANDLER.stopCreateAndConnectToTable,
          fail: function(error) {
            LOGGER.warn('Unable to connect to new table...');
            if (error === 'error') { error = 'Geen internetverbinding.'; }
            UIHANDLER.showCreateTableError(error);
          }
        });
      },
      fail: function(error) {
        LOGGER.warn('Unable to create table...');
        if (error === 'error') { error = 'Geen internetverbinding.'; }
        UIHANDLER.showCreateTableError(error);
        UIHANDLER.stopCreateAndConnectToTable();
      }
    });
  }
});

/******************************************************************************

                                HEADER FUNCTIONS

 ******************************************************************************/

// Show modal on cross sign.
var requestDisconnect = function() {
  disconnect();
};

$('#red-disconnect-btn').click(function(e) {
  disconnect();
});

// Connect sequence to sign out button.
var disconnect = function() {
  SESSION.disconnect({
    fail: LOGGER.error,
    success: UIHANDLER.backHome
  });
};

// Connect a sequence to the header toggle.
var toggleHeader = function() {
  UIHANDLER.toggleHeader();
};


// Connects sequence to stop tutorial.
$('#stoptutorial').click(function(e) {
  $('#clear-btn').show();
  $('#rule-send-btn').show();
  $('#reset-step').hide();
  $('.sendBotRule').addClass('hideme');
  $('#bottomgraph').html('');
  UIHANDLER.stopTutorial();
  try {
    step5Sequencer.killTable(function() {
      step5Sequencer.completed = true;
    });
  } catch(error) {}
  UIHANDLER.disableFullscreenWorkspace();
  workspace.clear();
  $('.blocklyToolboxDiv').show();
});

/******************************************************************************

                                CONTROL FUNCTIONS

 ******************************************************************************/

// Connects to fullscreen toggle.
var toggleFullscreenWorkspace = function() {
  UIHANDLER.toggleFullscreenWorkspace();
};

// Connects to the send rule button.
$('#rule-send-btn').click(function(e) {
  UIHANDLER.startSendRule();
  SESSION.sendRule(Blockly.Prolog.workspaceToCode(workspace), {
    fail: UIHANDLER.showRuleSentErrorMessage,
    final: function() {
      setTimeout(function() {
        UIHANDLER.stopSendRule();
      }, 1750);
    }
  });
});

// Connects to toggleDetailedView.
var toggleDetailedView = function() {
  UIHANDLER.toggleDetailedView();
};

/******************************************************************************

                                  ON PAGE LOAD

 ******************************************************************************/

$(document).ready(function(e) {
  customWorkspace('blockly-colors/custom.css', function() {
    workspace = Blockly.inject('blocklyDiv',
        {media: 'blockly/media/',
         sounds: false,
         toolbox: document.getElementById('toolbox')});
    Blockly.Xml.domToWorkspace(workspace,
            document.getElementById('startBlocks'));
    function myUpdateFunction() {
      var code = Blockly.Prolog.workspaceToCode(workspace);
      console.log(code);
    }
    workspace.addChangeListener(myUpdateFunction);
    $('#bargraph').load('elements/welcomebar.html');
  });
  updateTableSelectionList();
});

var SAVED_BLOCKS = [];

var saveWorkspace = function() {

  $('#save-workspace').addClass('loading');

  var dom = Blockly.Xml.workspaceToDom(workspace);
  var complete = Blockly.Xml.domToText(dom);
  var core = complete.substring(complete.indexOf('>') + 1, complete.length - 6);
  SAVED_BLOCKS.push(core);

  setTimeout(function() {
    var toolbox = '<xml>' + $('#toolbox').html() + '<category name="Opgeslagen">';
    for(var i = 0; i < SAVED_BLOCKS.length; i++) {
      toolbox += SAVED_BLOCKS[i] + '\n';
    }
    toolbox += '</category></xml>';
    workspace.updateToolbox(toolbox);
    $('#save-workspace').removeClass('loading');
  }, 500);

};

$(document).keyup(function(e) {
 if (e.keyCode == 27) {
   $('.ui.page.dimmer').dimmer('hide');
 }
});
