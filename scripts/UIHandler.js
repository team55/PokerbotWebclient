// Needs to access var workspace
var UIHANDLER = {

    updateViewsAfterConnectionEstablished: function () {
        UIHANDLER.updateHeaderAfterConnectionEstablished();
        UIHANDLER.updateButtonsAfterConnectionEstablished();
        UIHANDLER.includeGraphsAfterConnectionEstablished();
        UIHANDLER.activateSendRuleButton();
        UIHANDLER.makeConnectedTransition();
        UIHANDLER.clearConnectionForm();
        UIHANDLER.resizeWorkspace();
        UIHANDLER.hideSignInError();
        UIHANDLER.hideCreateTableLogAndError();
        var startUpBlocks = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="custom_if" x="50" y="50"><value name="IF0"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO0"><block type="poker_fold"></block></statement></block></xml>';
        workspace.clear();
        var dom = Blockly.Xml.textToDom(startUpBlocks);
        Blockly.Xml.domToWorkspace(workspace, dom);
    },

    updateHeaderAfterConnectionEstablished: function () {
        var label = '\
          <i class="unhide icon" onclick="toggleHeader()"></i>\
          <span class="ui image label">\
            <img src="img/person.jpg">' + SESSION.getAbbreviatedUsername() + '\
            <div class="detail">' + SESSION.getRawTablename() + '\
              <i onclick="requestDisconnect()" class="delete icon"></i>\
            </div>\
          </span>';
        $('#table-status')
            .html(label);
    },

    updateButtonsAfterConnectionEstablished: function () {
        $('#toggledimmer').hide();
        $('#red-disconnect-btn').show();
        $('#rulesendbtn')
            .removeClass('disabled');
        $('#detailedviewbtn')
            .removeClass('hideme');
    },

    includeGraphsAfterConnectionEstablished: function (callback) {
        UIHANDLER.includeTopGraph(function () {
            UIHANDLER.includeBarGraph(function () {
                //$('#bottomgraph').addClass('hideme');
                UIHANDLER.includeBottomGraph(function () {
                    UIHANDLER.resizeWorkspace();
                    UIHANDLER.hideDetailedView();
                    if (callback) callback();
                });
            });
        });
    },

    includeTopGraph: function (callback) {
        $('#topgraph')
            .load('elements/top.html', function() {
              $('#TopLoader').show();
              setTimeout(function() {
                $('#TopLoader').hide();
              }, 2000);
              callback();
            });
    },

    includeBarGraph: function (callback) {
        $('#bargraph')
            .load('elements/bar.html', function() {
              $('#BarLoader').show();
              setTimeout(function() {
                $('#BarLoader').hide();
              }, 1000);
              callback();
            });
    },

    includeBottomGraph: function (callback) {
        $('#bottomgraph')
            .load('elements/bottom.html', callback);
    },

    makeConnectedTransition: function () {
        $('#signin-overlay')
            .dimmer('hide');
    },

    clearConnectionForm: function () {
        $('#username')
            .val('');
    },

    resizeWorkspace: function () {
        Blockly.svgResize(workspace);
    },

    startTableListRefreshing: function () {
        $('#refresh-tables-btn')
            .addClass('loading');
    },

    stopTableListRefreshing: function () {
        $('#refresh-tables-btn')
            .removeClass('loading');
    },

    updateTableListSelect: function (result) {
        try {
            var data = $.parseJSON(result);
            var converted = {};
            for (var i = 0; i < data['tables'].length; i++)
                converted[data['tables'][i]['name']] = data['tables'][i]['name'];
            $('#tablename')
                .html($('<option></option>')
                    .attr('value', '')
                    .text('Kies een tafel'));
            $.each(converted, function (key, value) {
              if (!key.startsWith('Step5TableID'))
                $('#tablename')
                    .append($('<option></option>')
                        .attr('value', key)
                        .text(value));
            });
        } catch (error) {
            console.error(error);
        }
    },

    startConnectToTable: function () {
        $('#connect-btn')
            .addClass('loading');
    },

    stopConnectToTable: function () {
        $('#connect-btn')
            .removeClass('loading');
    },

    startCreateTable: function () {
        $('#create-table-btn')
            .addClass('loading');
    },

    stopCreateTable: function () {
        $('#create-table-btn')
            .removeClass('loading');
    },

    startCreateAndConnectToTable: function () {
        $('#create-table-and-connect-btn')
            .addClass('loading');
    },

    stopCreateAndConnectToTable: function () {
        $('#create-table-and-connect-btn')
            .removeClass('loading');
    },

    showSignInError: function (error) {
        $('#sign-in-error')
            .html(error);
        $('#sign-in-error')
            .show();
    },

    hideSignInError: function () {
        $('#sign-in-error')
            .hide();
    },

    showCreateTableLog: function (str) {
        $('#create-table-log')
            .html(str);
        $('#create-table-log')
            .show();
    },

    hideCreatTableLog: function () {
        $('#create-table-log')
            .hide();
    },

    showCreateTableError: function (error) {
        $('#create-table-error')
            .html(error);
        $('#create-table-error')
            .show();
    },

    hideCreateTableError: function () {
        $('#create-table-error')
            .hide();
    },

    hideCreateTableLogAndError: function () {
        UIHANDLER.hideCreatTableLog();
        UIHANDLER.hideCreateTableError();
    },

    clearCreateTableForm: function () {
        $('#table-create-tablename')
            .val('');
        $('#table-password')
            .val('');
        $('#table-players')
            .val('');
    },

    clearCreateTableAndConnectForm: function () {
        $('#table-create-username')
            .val('');
        UIHANDLER.clearCreateTableForm();
    },

    showDisconnectModal: function () {
        $('#disconnectmodal')
            .modal('hide');
        $('#disconnectmodal')
            .modal('show');
    },

    backHome: function () {
      $('#tableinfo').hide();
        UIHANDLER.resetTableStatus();
        UIHANDLER.resetGraphs();
        UIHANDLER.resetButtons();
        UIHANDLER.resetHeader();
        UIHANDLER.disableFullscreenWorkspace();
        UIHANDLER.disableSendRuleButton();
        UIHANDLER.resizeWorkspace();
    },

    resetTableStatus: function () {
        var label = '<span class="ui label">Geen verbinding met een tafel</span>';
        $('#table-status')
            .html(label);
    },

    resetGraphs: function () {
        $('#topgraph')
            .html('');
        $('#bottomgraph')
            .html('');
        $('#bargraph')
            .load('elements/welcomebar.html');
    },

    resetButtons: function () {
        $('#rulesendbtn')
            .addClass('disabled');
        $('#toggledimmer').show();
        $('#red-disconnect-btn').hide();
        $('#detailedviewbtn')
            .addClass('hideme');
    },

    resetHeader: function () {
        if ($('#header')
            .hasClass('hideme'))
            toggleHeader();
    },

    finishCreateTableAndConnect: function () {
        UIHANDLER.clearCreateTableAndConnectForm();
        UIHANDLER.updateViewsAfterConnectionEstablished();
    },

    activateSendRuleButton: function () {
        $('#rule-send-btn')
            .removeClass('disabled');
    },

    disableSendRuleButton: function () {
        $('#rule-send-btn')
            .addClass('disabled');
    },

    startSendRule: function () {
        $('#rule-send-btn')
            .addClass('loading');
    },

    showRuleSentErrorMessage() {
        $('#send-status')
            .show();
    },

    hideRuleSentErrorMessage() {
        $('#send-status')
            .hide();
    },

    stopSendRule: function () {
        UIHANDLER.hideRuleSentErrorMessage();
        $('#rule-send-btn')
            .removeClass('loading');
    },

    toggleHeader: function () {
        if ($('#header')
            .css('display') == 'none') {
            $('#header')
                .show();
            $('#toggledimmer')
                .show();
            $('#toggleheaderbtn')
                .removeClass('unhide');
            $('#toggleheaderbtn')
                .addClass('hide');
        } else {
            $('#header')
                .hide();
            $('#toggledimmer')
                .hide();
            $('#toggleheaderbtn')
                .removeClass('hide');
            $('#toggleheaderbtn')
                .addClass('unhide');
        }
        UIHANDLER.resizeWorkspace();
    },

    enableFullscreenWorkspace: function () {
        $('#blocklyDiv')
            .addClass('fullscreen fullscreen-margin');
        $('#blocks-bar')
            .removeClass('eleven wide column');
        $('#blocks-bar')
            .addClass('sixteen wide column');
        $('#bargraph')
            .hide();
        $('#rule-send-btn')
            .addClass('fullscreen-margin');
        $('#step-5-send-btn')
            .addClass('fullscreen-margin');
        $('#resize-btn')
            .html('Verklein');
        UIHANDLER.resizeWorkspace();
    },

    disableFullscreenWorkspace: function () {
        $('#blocklyDiv')
            .removeClass('fullscreen fullscreen-margin');
        $('#blocks-bar')
            .removeClass('sixteen wide column');
        $('#blocks-bar')
            .addClass('eleven wide column');
        $('#bargraph')
            .show();
        $('#step-5-send-btn')
            .removeClass('fullscreen-margin');
        try {
            fetchDataForBarCharts();
        } catch (error) {}
        $('#rule-send-btn')
            .removeClass('fullscreen-margin');
        $('#resize-btn')
            .html('Vergroot');
        UIHANDLER.resizeWorkspace();
    },

    toggleFullscreenWorkspace: function () {
        if (!$('#blocklyDiv')
            .hasClass('fullscreen')) {
            UIHANDLER.enableFullscreenWorkspace();
        } else {
            UIHANDLER.disableFullscreenWorkspace();
        }
    },

    showDetailedView: function () {
        $('#bottomgraph')
            .show();
        try {
            fetchBottomBarGraphsData();
        } catch (error) {
            console.error(error);
        }
        $('#detailedviewbtn')
            .html('Verberg details');
            /*
        $('html, body')
            .animate({
                scrollTop: $(document)
                    .height()
            }, 'slow');*/
    },

    hideDetailedView: function () {
        /*$('html, body')
            .animate({
                scrollTop: 0
            }, 'slow', function () {
                $('#bottomgraph')
                    .hide();
                $('#detailedviewbtn')
                    .html('Toon details');
            });*/
            $('#bottomgraph')
                .hide();

                $('#detailedviewbtn')
                    .html('Toon details');
    },

    showTutorialModal: function () {
        $('#stoptutorialmodal')
            .modal('hide');
        $('#stoptutorialmodal')
            .modal('show');
    },

    stopTutorial: function () {

        $('#stoptutorial')
            .hide();
        $('#toggledimmer')
            .removeClass('disabled');
        $('#bargraph')
            .load('elements/welcomebar.html');
        $('#bargraph')
            .removeClass('tutorialsuccess');
        $('#bargraph')
            .removeClass('tutorialfailed');
        $('#bargraph')
            .addClass('tutorialinfo');
        $('#topgraph')
            .html('');
        UIHANDLER.resizeWorkspace();
    },

    toggleDetailedView: function () {
        if ($('#bottomgraph')
            .css('display') == 'none') {
            UIHANDLER.showDetailedView();
        } else {
            UIHANDLER.hideDetailedView();
        }
    }

}
