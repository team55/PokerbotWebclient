Blockly.Blocks['poker_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("call");
    this.setPreviousStatement(true);
    this.setColour(20);
    this.setTooltip('Do action: call');
  }
};

Blockly.Blocks['poker_fold'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fold");
    this.setPreviousStatement(true);
    this.setColour(20);
    this.setTooltip('Do action: fold');
  }
};

Blockly.Blocks['poker_raise'] = {
  init: function() {
    this.appendValueInput("amount")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("raise");
    this.setPreviousStatement(true);
    this.setColour(20);
    this.setTooltip('Do action: raise by an amount');
  }
};
