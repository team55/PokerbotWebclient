
var workspace;

/******************************************************************************

                                  SIGN IN SECTION

 ******************************************************************************/

// Connects a the dimmer to the connect button.
$('#toggledimmer').click(function(e) {
  $('.ui.page.dimmer').dimmer('show');
});

// Connects a sequence to the refresh button (to refresh table selection).
var updateTableSelectionList = function() {
  SERVER.getTableList({
    success: UIHANDLER.updateTableListSelect,
    final: UIHANDLER.stopTableListRefreshing,
    fail: function(error) {
      LOGGER.warn('Unable to fetch table list...');
      UIHANDLER.showSignInERror('Er is een fout opgetreden.');
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
    success: function() {
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
 UIHANDLER.showDisconnectModal();
};

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

// Connect sequence to stop tutorial request.
$('#stoptutorial').click(function(e) {
  UIHANDLER.showTutorialModal();
});

// Connects sequence to stop tutorial.
$('#stoptutorialbutton').click(function(e) {
  UIHANDLER.stopTutorial();
  try {
    step5Sequencer.killTable(function() {
      step5Sequencer.completed = true;
    });
  } catch(error) {}
  UIHANDLER.disableFullscreenWorkspace();
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
         trashcan: false,
         toolbox: document.getElementById('toolbox')});
    Blockly.Xml.domToWorkspace(workspace,
            document.getElementById('startBlocks'));
    function myUpdateFunction() {
      var code = Blockly.Prolog.workspaceToCode(workspace);
      // If you need the prolog code, it can be logged here.
      //console.log(code);
    }
    workspace.addChangeListener(myUpdateFunction);
    $('#bargraph').load('elements/welcomebar.html');
  });
  updateTableSelectionList();
});

 /******************************************************************************

                              END OF REFACTORED CODE

 ******************************************************************************/

 var TutorialController = {
   current: 0,
   steps: [
     'stap 1: Inleiding',
     'stap 2: Als X, dan Y',
     'stap 3: Complexe handen',
     'stap 4: Sequenties',
     'stap 5: Versla een bot'
   ],
   locations: [
     'introduction',
     'stap 2: Als X, dan Y',
     'stap 3: Complexe handen',
     'stap 4: Sequenties',
     'stap 5: Versla een bot'
   ],
   currentTitle: function() {
     var str = this.steps[this.current - 1];
     var elems = (str[0].toUpperCase() + str.slice(1)).split(':');
     return elems[elems.length-1].trim();
   },
   final: 'finished',

   start: function() {
     this.current = 1;
     $('#bargraph').load('tutorials/container.html', function() {
       TutorialController.injectChapter(1);
       $('#tutorial-title').html(TutorialController.currentTitle());
       $.each(TutorialController.steps, function(index, element) {
         console.log('eh');
         $('#tutorial-chapter-select').append('<option value="'+element+'">'+element[0].toUpperCase() + element.slice(1)+'</option>');
       });
     });

   },

   injectChapter: function(i) {
     i = Math.abs(i);
     if (i > this.steps.length) return;
     var step = this.locations[i - 1];
     $('#tutorial-container').load('tutorials/'+step+'/main.html', function() {
       TutorialController.createStepSwitcher();
       TutorialController.current = i;
       TutorialController._initializeNewChapter();
     });
   },

   createStepSwitcher: function() {
     console.log('count:' + $('.tutorial-step').length);
   },

   next: function() {
     this.current++;
     if (this.current <= this.steps.length) {
       var step = this.steps[this.current - 1];
       var location = 'tutorials/' + step + '/main.html';
       $('#bargraph').load(location);
     }
   },




   _currentView: 1,
   _finishedStep: 0,

   _initializeNewChapter: function() {
     this._initializeNextStepButtons();
     this._initializeBackStepButtons();
     this._redraw();
     workspace.addChangeListener(this._checkForSolution);
   },
   _initializeNextStepButtons: function() {
     $('.next-step-view').click(function(e) {
       TutorialController._currentView++;
       TutorialController._finishedStep = TutorialController._currentView - 1;
       if (TutorialController._currentView > $('.tutorial-step').length) {
         TutorialController._chapterFinished();
       } else { TutorialController._redraw(); }
     });
   },
   _initializeBackStepButtons: function() {
     $('.back-step-view').click(function(e) {
       TutorialController._currentView--;
       TutorialController._finishedStep = TutorialController._currentView - 1;
       if (TutorialController._currentView < 1) { console.error('Tut.: 1'); }
       else { TutorialController._redraw(); }
     });
   },

   _chapterFinished: function() {
     this._currentView = $('.tutorial-step').length;
     console.error('Chapter finished but no callback provided.');
   },

   _checkForSolution: function() {
     $('.tutorial-step').each(function(index) {
       if (index == (TutorialController._currentView - 1)
            && $(this).hasClass('step-interaction')) {
              var solution = $(this).find('.workspace-solution').first().html();
              var markup = Blockly.Xml.workspaceToDom(workspace);
              var provided = Blockly.Xml.domToText(markup);
              if (Utils.equalBlocks(solution, provided))
                TutorialController._reportSolution();
            }
     });
   },
   _reportSolution: function() {
     this._finishedStep = this._currentView;
     this._redraw();
   },

   _redraw: function() {
     $('.tutorial-step').each(function(index) {
       if (index == (TutorialController._currentView - 1)) {
         $(this).show();
         $('.blocklyToolboxDiv').hide();
         if (!$(this).hasClass('hide-toolbox')) $('.blocklyToolboxDiv').show();
         if ($(this).hasClass('clear-workspace')) workspace.clear();
         if ($(this).hasClass('step-interaction')) {
           if (TutorialController._finishedStep < TutorialController._currentView) {
             $(this).find('.next-step-view').addClass('disabled');
             workspace.clear();
             var data = $(this).find('.workspace-data').first().html();
             var dom = Blockly.Xml.textToDom(data);
             Blockly.Xml.domToWorkspace(workspace, dom);
           } else {
             $(this).find('.next-step-view').removeClass('disabled');
           }
         }
       } else { $(this).hide(); }
     });
   },










 };
