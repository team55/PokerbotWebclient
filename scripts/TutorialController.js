
/**
 * This file contains a controller to control the sequence of the modules in
 * the tutorial section. You can add, remove and move modules in the tutorial
 * sequence by editing the TutorialController.chapters variable.
 *
 * This file should be included in the index.html and uses the variable
 * 'TutorialController' to store the controller.
 *
 * DO NOT OVERWRITE VARIABLE TutorialController!
 *
 * @version   1.0
 */

var TUTORIAL_CONTROLLER_DEFAULT_VIEW_VALUE = 1;
var TUTORIAL_CONTROLLER_DEFAULT_CHAPTER_VALUE = 0;
var TUTORIAL_CONTROLLER_DEFAULT_FINISHED_STEP_VALUE = 0;


/**
 * The controller that controls the sequence in the tutorial section. It is
 * possible to edit the TutorialController.chapters variable, but it is not
 * advisable to do so while the tutorial is running. To see whether or not this
 * controller is operating at the moment, use isOperating().
 */
var TutorialController = {

  // The number of the current chapter that is displayed (>= 1).
  currentChapter: TUTORIAL_CONTROLLER_DEFAULT_CHAPTER_VALUE,
  // The number of the current view that is displayed.
  _currentView: TUTORIAL_CONTROLLER_DEFAULT_VIEW_VALUE,
  // The number of the last finished view.
  _finishedStep: TUTORIAL_CONTROLLER_DEFAULT_FINISHED_STEP_VALUE,

  /**
   *  This is a list of the chapters for the current tutorial. In case you
   *  would like to change the order, drop or add modules, you can do it here.
   */
  chapters: [{
    name: 'Hoofdstuk 1: Blokken maken',
    path: 'introduction'
  },{
    name: 'Hoofdstuk 2: Als-Dan',
    path: 'ifstatement'
  },{
    name: 'Hoofdstuk 3: Zinvolle regels',
    path: 'firstrules'
  }, {
    name: 'Hoofdstuk 4: Rhobot',
    path: 'bot'
  }, {
    name: 'Hoofdstuk 5: Sigmabot',
    path: 'hard'
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
      $('#clear-btn').hide();
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
    $('#topgraph').html('');
    $('#bottomgraph').html('');
    UIHANDLER.resizeWorkspace();
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
      TutorialController._finishedStep = TutorialController._currentView;
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
             $(this).find('.workspace-solution').each(function() {
               var solution = $(this).html();
               var markup = Blockly.Xml.workspaceToDom(workspace);
               var provided = Blockly.Xml.domToText(markup);
               if (Utils.equalBlocks(solution, provided))
                 TutorialController._reportSolution();
             });
           }
    });
  },
  _reportSolution: function() {
    this._finishedStep = this._currentView;
    this._redraw();
  },
  _redraw: function() {
    $('#tutorial-progress').attr('data-value', this._currentView);
    $('#tutorial-progress').attr('data-total', $('.tutorial-step').length);
    var progress = parseFloat(this._currentView - 1) / parseFloat($('.tutorial-step').length - 1);
    if (!(this._currentView == $('.tutorial-step').length)) {
      $('#tutorial-progress').progress('set percent', progress);
      $('.progress-data').html(String(this._currentView - 1) + '/' + String($('.tutorial-step').length - 1) + ' voltooid')
    } else {
      $('#tutorial-progress').progress('complete');
      $('.progress-data').html(this.currentChapterName() + ' voltooid');
    }
    $('.tutorial-step').each(function(index) {
      if (index == (TutorialController._currentView - 1)) {
        if ($(this).hasClass('no-progress')) {
          $('#tutorial-progress').hide();
          $('.progress-data').hide();
        } else {
          $('#tutorial-progress').show();
          $('.progress-data').show();
        }
        $(this).show();
        $('.blocklyToolboxDiv').hide();
        if (!$(this).hasClass('hide-toolbox')) $('.blocklyToolboxDiv').show();
        if ($(this).hasClass('clear-workspace')) workspace.clear();
        if ($(this).hasClass('no-reset')) {
          $('#reset-step').hide();
        } else { $('#reset-step').show(); }
        if ($(this).hasClass('step-interaction') || $(this).hasClass('step-bot')) {
          if (TutorialController._finishedStep < TutorialController._currentView) {
            $('#bargraph').addClass('tutorialinfo');
            $('#bargraph').removeClass('tutorialsuccess');
            $('#bargraph').removeClass('tutorialfailed');
            $('.on-success').hide();
            $('.before-success').show();
            $(this).find('.next-step-view').addClass('disabled');
            workspace.clear();
            if ($(this).hasClass('step-interaction')) {
              var data = $(this).find('.workspace-data').first().html();
              var dom = Blockly.Xml.textToDom(data);
              Blockly.Xml.domToWorkspace(workspace, dom);
            }
          } else {
            if (!($(this).hasClass('no-success'))) {
              $('#bargraph').addClass('tutorialsuccess');
              $('#bargraph').removeClass('tutorialinfo');
              $('#bargraph').removeClass('tutorialfailed');
            }
            $('.before-success').hide();
            $('.on-success').show();
            $(this).find('.next-step-view').removeClass('disabled');
          }
        } else {
          $('#bargraph').addClass('tutorialinfo');
          $('#bargraph').removeClass('tutorialsuccess');
          $('#bargraph').removeClass('tutorialfailed');
          if ($(this).hasClass('always-success')) {
            $('#bargraph').addClass('tutorialsuccess');
            $('#bargraph').removeClass('tutorialinfo');
            $('#bargraph').removeClass('tutorialfailed');
          }
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
  },

  /**
   * Returns whether or not the TutorialController is oprating aka the tutorial
   * is displayed.
   * @return  true if and only if the currentChapter === default value.
   */
  isOperating: function() {
    return this.currentChapter === TUTORIAL_CONTROLLER_DEFAULT_CHAPTER_VALUE;
  },

  resetWorkspaceForstep: function() {
    this._finishedStep = this._currentView - 1;
    TutorialController._redraw();
  }


 };
