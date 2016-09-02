
/**
 *  This code will link the BLOCKLY workspace to a CSS file for better
 *  customization. This file should be required AFTER the BLOCKLY libs and
 *  also requires JQUERY.
 *
 *  Blockly-colors makes it possible to link custom CSS files to the basic
 *  BLOCKLY workspace. The original styles will be overwritten! You can better
 *  start from the template in this folder (blocks.or.css). We use custom.css.
 *
 *  You can call this function like this:
 *
 *    customWorkspace('css/blocks.css', function() {
 *      Blockly.inject ... (etc)
 *    });
 *
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
