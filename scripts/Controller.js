/**
 *  This file contains the main interaction of the webpage. For example, it will
 *  link buttons and functions, hide and show divs etc. It contains the main
 *  timelines for certain actions. It requires JQuery and Semantic UI to run.
 */

var workspace;

/**
*  Checks if the 'Create-Table'-form has valid info to create a new table.
*  Returns true if and only if no field equals an empty string.
*/
var isValidCreateTableForm = function() {
  return !(    $('#players').val() === ''
            || $('#tablepassword').val() === ''
            || $('#tablecreatename').val() === '' );
}

/**
 *  Show the dimmer on the page with the options to log in or create a table.
 */
$('#toggledimmer').click(function(e) {
  $('.ui.page.dimmer').dimmer('show');
});

/**
 *  Create a new table using the data of the 'Create-Table'-form.
 */
$('#createtable').click(function(e) {
  if (isValidCreateTableForm()) {
    var table = $('#tablecreatename').val();
    var password = $('#tablepassword').val();
    var players = parseInt($('#players').val(), 10);
    Server.createTable(table, password, players);
  } else {
    Logger.error('Opgegeven data is ongeldig of tekort.', 'CREATETABLE');
  }
});

/**
 *  Connect the user to the table with the data of the 'Connect'-form.
 */
$('#connectbtn').click(function(e) {
  var username = $('#username').val().replace(' ', '');
  var table = $('#tablename').val();
  Server.connect(username, table);
});

/**
 *  Make a user disconnect if he wants to.
 */
var disconnect = function() {
  $('#disconnectmodal').modal('show');
}
$('#disconnectbtn').click(function(e) {
  Client.signout();
});

/**
 *  Stop de tutorial.
 */
$('#stoptutorial').click(function(e) {
  $('#stoptutorialmodal').modal('show');
});
$('#stoptutorialbutton').click(function(e) {
  $('#stoptutorial').hide();
  $('#toggledimmer').removeClass('disabled');
  $('#bargraph').load('elements/welcomebar.html');
  $('#bargraph').removeClass('tutorialsuccess');
  $('#bargraph').addClass('tutorialinfo');
});

/**
 *  Shows the XML of the current block structure (alert).
 */
var saveWorkspace = function() {
  var xml = Blockly.Xml.workspaceToDom(workspace);
  var xml_text = Blockly.Xml.domToText(xml);
  alert(xml_text);
}

/**
 *  Asks for XML of Block structure (alert) and creates it in the workspace.
 */
var loadWorkspace = function() {
  var result = prompt("Enter xml");
  var dom = Blockly.Xml.textToDom(result);
  Blockly.Xml.domToWorkspace(workspace, dom);
}

/**
 *  Sends the rules to the Server.
 */
var sendCode = function() {
  if (Client.isSignedIn()) {
    var code = Blockly.Prolog.workspaceToCode(workspace);
    Server.sendRule(Client.username, Client.table, code);
  } else {
    console.err('Not signed in!');
  }
}

/**
 *  Function to hide and show the header when signed in.
 */
var toggleHeader = function() {
  if ($('#header').hasClass('hideme')) {
    $('#header').removeClass('hideme');
  } else {
    $('#header').addClass('hideme');
  }
  if ($('#toggledimmer').hasClass('hideme')) {
    $('#toggledimmer').removeClass('hideme');
  } else {
    $('#toggledimmer').addClass('hideme');
  }
  if ($('#toggleheaderbtn').hasClass('unhide')) {
    $('#toggleheaderbtn').removeClass('unhide');
    $('#toggleheaderbtn').addClass('hide');
  } else {
    $('#toggleheaderbtn').removeClass('hide');
    $('#toggleheaderbtn').addClass('unhide');
  }
  Blockly.svgResize(workspace);
}

/**
 *  Execute the following commands on load.
 */
$(document).ready(function() {
  customWorkspace('blockly-colors/custom.css', function() {
    workspace = Blockly.inject('blocklyDiv',
        {media: 'blockly/media/',
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
});
