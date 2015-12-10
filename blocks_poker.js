/* Actions */

Blockly.Blocks['poker_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("call");
    this.setPreviousStatement(true);
    this.setColour(120);
    this.setTooltip('Do action: call');
  }
};

Blockly.Blocks['poker_fold'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fold");
    this.setPreviousStatement(true);
    this.setColour(120);
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
    this.setColour(120);
    this.setTooltip('Do action: raise by an amount');
  }
};

/* Cards */

Blockly.Blocks['poker_cards'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("cards in ")
        .appendField(new Blockly.FieldDropdown([["hand", "handkaarten"], ["table", "tafelkaarten"], ["hand and table", "allekaarten"]]), "in");
    this.appendStatementInput("cardlist")
        .setCheck("POKER_TYPE_CARD")
        .appendField("contains");
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(210);
    this.setTooltip('whether there are cards with certain properties (you can drag multiple cards in to denote different cards)');
  }
};

Blockly.Blocks['poker_card'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("a card with");
    this.appendValueInput("arg_color")
        .setCheck("POKER_TYPE_COLOR")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("color:");
    this.appendValueInput("arg_rank")
        .setCheck("POKER_TYPE_RANK")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("rank:");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "POKER_TYPE_CARD");
    this.setNextStatement(true, "POKER_TYPE_CARD");
    this.setColour(20);
    this.setTooltip('declare properties of a specific card');
  }
};

Blockly.Blocks['poker_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("color = ")
        .appendField(new Blockly.FieldDropdown([["red", "red"], ["black", "black"]]), "color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(290);
    this.setTooltip('color is red (hearts, diamonds) or black (spades, clubs)');
  }
};
Blockly.Blocks['poker_color_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(290);
    this.setTooltip('can be any suit of any color');
  }
};
Blockly.Blocks['poker_color_same'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same color (group");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(290);
    this.setTooltip('cards with \'same color\' and same group number will match if they have the same color (e.g. each of them is red)');
  }
};

Blockly.Blocks['poker_rank'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rank ")
        .appendField(new Blockly.FieldDropdown([[">=", ">="], [">", ">"], ["<=", "=<"], ["<", "<"], ["=", "=:="], ["!=", "=\\="]]), "op")
        .appendField(new Blockly.FieldDropdown([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["Jack", "11"], ["Queen", "12"], ["King", "13"], ["Ace", "14"]]), "rank");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(330);
    this.setTooltip('whether the cards rank (value/symbol) satisfies the relation');
  }
};
Blockly.Blocks['poker_rank_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any rank");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(330);
    this.setTooltip('can be any rank (value/symbol)');
  }
};
Blockly.Blocks['poker_rank_same'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same rank (group");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(330);
    this.setTooltip('cards with \'same rank\' and same group number will match if they have the same rank (e.g. each of them is an ace)');
  }
};
Blockly.Blocks['poker_rank_incr'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same rank (group");
    this.appendDummyInput()
        .appendField(") +");
    this.appendValueInput("incr")
        .setCheck("Number");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(330);
    this.setTooltip('use this to enforce increasing cards (+1, +2, +3, ...) for one group of \'same rank\' cards');
  }
};
