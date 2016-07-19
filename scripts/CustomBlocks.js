
/**
 *  This code will link the BLOCKLY workspace to a CSS file for better
 *  customization. This file should be required AFTER the BLOCKLY libs and
 *  also requires JQUERY.
 */
var customWorkspace = function(css, callback) {
  $.ajax({ url: css, method: 'GET', success: function(result) {
    Blockly.Css.CONTENT = result.replace(/(\r\n)|\r|\n/g, '\n').split(/\n+/g);
    callback();
  }, error: function(error) {
    console.error('Unable to load custom workspace!');
    console.error(error);
  }});
};
