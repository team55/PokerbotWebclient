/**
 *  This file contains the main interaction of the webpage. For example, it will
 *  link buttons and functions, hide and show divs etc. It contains the main
 *  timelines for certain actions. It requires JQuery and Semantic UI to run.
 */

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
  var username = $('#username').val();
  var table = $('#tablename').val();
  Server.connect(username, table);
});

/**
 *  Make a user disconnect if he wants to.
 */
var disconnect = function() {
  $('.ui.modal').modal('show');
}
$('#disconnectbtn').click(function(e) {
  Client.signout();
});

/**
 *  Execute the following commands on load.
 */
$(document).ready(function() {
  $('#bargraph').load('elements/welcomebar.html');
});
