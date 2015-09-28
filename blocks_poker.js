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

Blockly.Blocks['poker_card_set'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["hand cards", "hand"], ["table cards", "table"], ["hand and table cards", "all"]]), "NAME");
    this.setOutput(true, "POKER_TYPE_CARDSET");
    this.setColour(330);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_in'] = {
  init: function() {
    this.appendValueInput("nr")
        .setCheck("Number")
        .appendField("any");
    this.appendValueInput("set")
        .setCheck("POKER_TYPE_CARDSET")
        .appendField("card(s) in");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_CARDSET");
    this.setColour(330);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_suit'] = {
  init: function() {
    this.appendValueInput("cardset")
        .setCheck("POKER_TYPE_CARDSET");
    this.appendDummyInput()
        .appendField("have suit equal to")
        .appendField(new Blockly.FieldDropdown([["hearts", "hearts"], ["diamonds", "diamonds"], ["clubs", "clubs"], ["spades", "spades"], ["same suit", "same"]]), "NAME");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_valeq'] = {
  init: function() {
    this.appendValueInput("cardset")
        .setCheck("POKER_TYPE_CARDSET");
    this.appendDummyInput()
        .appendField("have")
        .appendField(new Blockly.FieldDropdown([["same", "same"], ["increasing", "increasing"]]), "NAME")
        .appendField("values");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_valop'] = {
  init: function() {
    this.appendValueInput("cardset")
        .setCheck("POKER_TYPE_CARDSET");
    this.appendDummyInput()
        .appendField("have value")
        .appendField(new Blockly.FieldDropdown([["=", "eq"], [">=", "gq"], [">", "gr"], ["<=", "lq"], ["<", "le"], ["!=", "nq"]]), "OP");
    this.appendValueInput("value")
        .setCheck("POKER_TYPE_CARD");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_val'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["Jack", "11"], ["Queen", "12"], ["King", "13"], ["Ace", "14"]]), "val");
    this.setOutput(true, "POKER_TYPE_CARD");
    this.setColour(290);
    this.setTooltip('');
  }
};
