
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

                              TUTORIALCONTROLLER

 ******************************************************************************/

var TutorialController = {

  currentChapter: 0,
  _currentView: 1,
  _finishedStep: 0,

  /**
   *  This is a list of the chapters for the current tutorial. In case you
   *  would like to change the order, drop or add modules, you can do it here.
   */
  chapters: [{
    name: 'Hoofdstuk 1: Inleiding',
    path: 'introduction'
  },{
    name: 'Hoofdstuk 2: Als X, dan Y',
    path: 'ifstatement'
  },{
    name: 'Hoofdstuk 3: Zinvolle regels',
    path: 'firstrules'
  },{
    name: 'Hoofdstuk 4: Volgorde',
    path: 'order'
  }],

  /**
   * This variable holds the final view when the complete tutorial is finished.
   * It is impossible to jump to it; It's also impossible to go back (except
   * the select box controls).
   */
  finalChapter: {
    name: 'Gefeliciteerd!',
    path: 'final'
  },

  /**
   * Returns the full name of the current chapter as it is written in the
   * chapters list of this Controller. If the Controller is not started,
   * 'undefined' will be returned.
   */
  currentChapterName: function() {
    return this.chapterName(this.currentChapter);
  },

  /**
   * Returns the full name of the ith chapter as it is written in the chapters
   * list of this Controller. If the given i value is invalid, 'undefined' will
   * be returned.
   */
  chapterName: function(i) {
    if (i > this.chapters.length || i < 0) return 'undefined';
    return this.chapters[i - 1]['name'];
  },

  /**
   * Returns a formatted title of the current chapter that is ready to display
   * to the user (Pascal Case). It also removes the prefix (before ':'). If the
   * Controller is not started yet, 'undefined' will be returned.
   * i.e. 'Stap 3: Als X, dan Y' becomes 'Als X, dan Y'.
   */
  currentChapterTitle: function() {
    return this.chapterTitle(this.currentChapter);
  },

  /**
   * Returns a formatted title of the ith chapter that is ready to diplay to the
   * user (Pascal Case). It also removes the prefix (before ':'). If the
   * given value i is invalid, 'undefined' will be returned.
   * i.e. for i = 3: 'Als X, dan Y'.
   */
  chapterTitle: function(i) {
    var raw = this.chapterName(i);
    var elems = (raw[0].toUpperCase() + raw.slice(1)).split(':');
    return elems[elems.length - 1].trim();
  },

  /**
   * Starts the tutorial sequence when no chapter was loaded yet. It has to be
   * called in the beginning because the main container for the chapters should
   * be loaded first. It also initializes the ChapterSwitcher (select box) and
   * initializes the first chapter.
   */
  start: function() {
    $('#bargraph').load('tutorials/container.html', function() {
      TutorialController.setChapter(1);
      $('#tutorial-chapter-select').change(TutorialController._chapterSwitch);
      $.each(TutorialController.chapters, function(index, element) {
        $('#tutorial-chapter-select').append('\
          <option value="'+index+'">\
            ' + element['name'][0].toUpperCase() + element['name'].slice(1) + '\
          </option>');
      });

      $('#bargraph').addClass('tutorialinfo');
      $('#stoptutorial').show();
      $('#toggledimmer').addClass('disabled');
    });
  },

  /**
   * This functions sets the values of this Controller to the start values. That
   * way the Controller can be reset. It does not redraw the layout.
   */
  stop: function() {
    this.chapter = 1;
    this._currentView = 0;
    this._finishedStep = 0;
  },

  /**
   * This functions loads the final module which is defined in the finalChapter
   * variable of this controller. It should only be called when the last chapter
   * from this.chapters is finished.
   */
  finish: function() {
    this.currentChapter = -1;
    var path = this.finalChapter['path'];
    var location = 'tutorials/' + path + '/main.html';
    $('#tutorial-container').load(location, function() {
      $('#tutorial-title').html(TutorialController.finalChapter['name']);
      TutorialController._initializeNewChapter();
    });
    $('#tutorial-chapter-select').val(0);
  },

  /**
   * Sets the chapter to the nth one. If it does not exists, it won't do
   * anything. Chapter number start from 1, not 0.
   */
  setChapter: function(i) {
    if (Math.abs(i) > this.chapters.length) return;
    this.currentChapter = Math.abs(i);
    var path = this.chapters[this.currentChapter - 1]['path'];
    this._buildChapterUI('tutorials/' + path + '/main.html');
    $('#tutorial-chapter-select').val(this.currentChapter - 1);
  },

  _buildChapterUI: function(path) {
    $('#tutorial-container').load(path, function() {
      $('#tutorial-title').html(TutorialController.currentChapterTitle());
      TutorialController._initializeNewChapter();
    });
  },
  _initializeNewChapter: function() {
    this._currentView = 1;
    this._finishedStep = 0;
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
            $('#bargraph').addClass('tutorialinfo');
            $('#bargraph').removeClass('tutorialsuccess');
            $('#bargraph').removeClass('tutorialfailed');
            $('.on-success').hide();
            $('.before-success').show();
            $(this).find('.next-step-view').addClass('disabled');
            workspace.clear();
            var data = $(this).find('.workspace-data').first().html();
            var dom = Blockly.Xml.textToDom(data);
            Blockly.Xml.domToWorkspace(workspace, dom);
          } else {
            if (!($(this).hasClass('no-success'))) {
              $('#bargraph').addClass('tutorialsuccess');
              $('#bargraph').removeClass('tutorialinfo');
              $('#bargraph').removeClass('tutorialfailed');
            }
            $('.before-success').hide();
            $('.on-success').show();
            $('#step-description').append('<i class="huge yellow trophy icon"></i><br /><br /><br />');
            $(this).find('.next-step-view').removeClass('disabled');
          }
        } else {
          $('#bargraph').addClass('tutorialinfo');
          $('#bargraph').removeClass('tutorialsuccess');
          $('#bargraph').removeClass('tutorialfailed');
        }
      } else { $(this).hide(); }
    });
  },

  _chapterFinished: function() {
    this._currentView = $('.tutorial-step').length;
    if (this.currentChapter == this.chapters.length) {
      this.finish();
    } else {
      this.setChapter(this.currentChapter + 1);
    }
  },

  _chapterSwitch: function() {
    var value = parseInt($('#tutorial-chapter-select').val(), 10) + 1;
    $('#topgraph').html('');
    TutorialController.setChapter(value);
  }

 };
