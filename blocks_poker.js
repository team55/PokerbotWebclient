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
        .appendField(new Blockly.FieldDropdown([["hand cards", "handkaarten"], ["table cards", "tafelkaarten"], ["hand and table cards", "allekaarten"]]), "NAME");
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
        .appendField(new Blockly.FieldDropdown([["hearts", "h"], ["diamonds", "d"], ["clubs", "c"], ["spades", "s"], ["same suit", "same"]]), "NAME");
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
        .appendField(new Blockly.FieldDropdown([["=", "=:="], [">=", ">="], [">", ">"], ["<=", "=<"], ["<", "<"], ["!=", "=\\="]]), "OP");
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


Blockly.Blocks['poker_card_in2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("cards in ")
        .appendField(new Blockly.FieldDropdown([["hand", "hand"], ["table", "table"], ["hand and table", "both"]]), "cards");
    this.appendStatementInput("NAME")
        .setCheck("POKER_CARD2")
        .appendField("contains");
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['poker_card_card'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("a card with");
    this.appendValueInput("col")
        .setCheck("POKER_TYPE_COL2")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("color:");
    this.appendValueInput("val")
        .setCheck("POKER_TYPE_VAL2")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("value:");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "POKER_CARD2");
    this.setNextStatement(true, "POKER_CARD2");
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['poker_card_col_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any color");
    this.setOutput(true, "POKER_TYPE_COL2");
    this.setColour(275);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['poker_card_col2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["red", "red"], ["black", "black"]]), "NAME");
    this.setOutput(true, "POKER_TYPE_COL2");
    this.setColour(275);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['poker_card_col_same'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same color (group");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_COL2");
    this.setColour(275);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['poker_card_val_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any value");
    this.setOutput(true, "POKER_TYPE_VAL2");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['poker_card_val2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[">=", ">="], [">", ">"], ["<=", "=<"], ["<", "<"], ["=", "=:="], ["!=", "=\\="]]), "OP")
        .appendField(new Blockly.FieldDropdown([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["Jack", "11"], ["Queen", "12"], ["King", "13"], ["Ace", "14"]]), "val");
    this.setOutput(true, "POKER_TYPE_VAL2");
    this.setColour(290);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_val_same'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same value (group");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_VAL2");
    this.setColour(290);
    this.setTooltip('');
  }
};

Blockly.Blocks['poker_card_val_sameplus'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same value (group");
    this.appendDummyInput()
        .appendField(") +");
    this.appendValueInput("incr")
        .setCheck("Number");
    this.setOutput(true, "POKER_TYPE_VAL2");
    this.setColour(290);
    this.setTooltip('Use this to enforce increasing cards (+1, +2, +3, ...)');
  }
};
