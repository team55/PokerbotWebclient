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
var isValidCreateTableAndSitForm = function() {
  return !($('#tablecreateusername').val() === '') && isValidCreateTableForm();
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
  $('#createtable').addClass('loading');
  if (isValidCreateTableForm()) {
    var table = $('#tablecreatename').val();
    var password = $('#tablepassword').val();
    var players = parseInt($('#players').val(), 10);
    Server.createTable(table, password, players, function() {
      updateTables();
      $('#createtable').removeClass('loading');
    });
  } else {
    Logger.error('Opgegeven data is ongeldig of tekort.', 'CREATETABLE');
    $('#createtable').removeClass('loading');
  }
});
$('#createtableandsit').click(function(e) {
  $('#createtableandsit').addClass('loading');
  if (isValidCreateTableAndSitForm()) {
    var table = $('#tablecreatename').val();
    var password = $('#tablepassword').val();
    var players = parseInt($('#players').val(), 10);
    Server.createTable(table, password, players, function() {
      var username = $('#tablecreateusername').val();
      Server.connect(username, table);
      updateTables();
      $('#createtableandsit').removeClass('loading');
    });
  } else {
    Logger.error('Opgegeven data is ongeldig of tekort.', 'CREATETABLE');
    $('#createtableandsit').removeClass('loading');
  }
});

/**
 *  Connect the user to the table with the data of the 'Connect'-form.
 */
$('#connectbtn').click(function(e) {
  $('#connectbtn').addClass('loading');
  var username = $('#username').val().replace(' ', '');
  var table = $('#tablename').val();
  console.log(username);
  console.log(table);
  if (!(username === '' || table === '')) {
    Server.connect(username, table, function() {
      $('#connectbtn').removeClass('loading');
    });
  } else {
    Logger.error('Ongeldige gegevens.', 'SIGNIN');
    $('#connectbtn').removeClass('loading');
  }
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
  $('#bargraph').removeClass('tutorialfailed');
  $('#bargraph').addClass('tutorialinfo');
  $('#topgraph').html('');
  Blockly.svgResize(workspace);
  try {
    step5Sequencer.killTable(function() {
      step5Sequencer.completed = true;
      console.log('Table removed!');
    });
  } catch(error) {}
  if (isFullscreenWorkspace()) { toggleFullscreenWorkspace(); }
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
 *  Go fullscreen.
 */
var isFullscreenWorkspace = function() {
  return $('#blocklyDiv').hasClass('fullscreen');
};
var toggleFullscreenWorkspace = function() {
  console.log('going fullscreen');
  if (!$('#blocklyDiv').hasClass('fullscreen')) {
    $('#blocklyDiv').addClass('fullscreen fullscreen-margin');
    $('#blocks-bar').removeClass('eleven wide column');
    $('#blocks-bar').addClass('sixteen wide column');
    $('#bargraph').addClass('hideme');
    $('#controls').addClass('fullscreen-margin');
    $('#resize-btn').html('Verklein');
  } else {
    $('#blocklyDiv').removeClass('fullscreen fullscreen-margin');
    $('#blocks-bar').removeClass('sixteen wide column');
    $('#blocks-bar').addClass('eleven wide column');
    $('#bargraph').removeClass('hideme');
    $('#rulesendbtn').removeClass('fullscreen-margin');
    $('#resize-btn').html('Vergroot');
  }
  Blockly.svgResize(workspace);
};

/**
 *  Updates the tables to the new table list.
 */
var updateTables = function() {
  var url = 'http://bear.cs.kuleuven.be/pokerdemo/server/get_tables.php';
  $.get(url, function(result) {
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
  });
};
$('#refreshtables').click(function(e) {
  updateTables();
});

var toggleDetailedView = function() {
  if (!$('#bottomgraph').hasClass('hideme')) {
    $('html, body').animate({scrollTop:0}, 'slow', function() {
      $('#bottomgraph').addClass('hideme');
      $('#detailedviewbtn').html('Toon details');
    });
  } else {
    $('#bottomgraph').removeClass('hideme');
    $('#detailedviewbtn').html('Verberg details');
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
  }
}

/**
 *  Execute the following commands on load.
 */
$(document).ready(function() {
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
      console.log(code);
      console.log(Blockly.Xml.workspaceToDom(workspace));
    }
    workspace.addChangeListener(myUpdateFunction);
    $('#bargraph').load('elements/welcomebar.html');
  });
  updateTables();
});
