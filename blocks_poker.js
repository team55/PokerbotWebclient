
/* Booleans */

var boolcolor = 210;

Blockly.Blocks['is_preflop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is preflop");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if flop is unseen');
  }
};
Blockly.Blocks['is_flop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is flop");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if we are on the flop');
  }
};
Blockly.Blocks['is_turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is turn");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if we are on the turn');
  }
};
Blockly.Blocks['is_river'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is river");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if we are on the river');
  }
};
Blockly.Blocks['is_postflop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is postflop");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks the flop is seen');
  }
};
Blockly.Blocks['is_small_blind'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is small blind");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if we are in the small blind');
  }
};
Blockly.Blocks['is_big_blind'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is big blind");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if we are in the big blind');
  }
};
Blockly.Blocks['is_dealer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is dealer");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Checks if we are the dealer');
  }
};

/* Numeric */

var numcolor = 230;

Blockly.Blocks['stacksize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stacksize");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Your current stacksize');
  }
};
Blockly.Blocks['potsize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("potsize");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The current potsize');
  }
};
Blockly.Blocks['active_players'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number of active players");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The number of active players');
  }
};
Blockly.Blocks['non_allin_active_players'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number of active players (not all-in)");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The number of active players (not all-in)');
  }
};
Blockly.Blocks['amount_to_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("amount to call");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The amount to call');
  }
};
Blockly.Blocks['max_profit'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("maximum profit");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The maximum profit for this hand');
  }
};
Blockly.Blocks['min_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("the minimum amount to raise");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The minimum amount to raise');
  }
};
Blockly.Blocks['max_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("maximum amount to raise");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The maximum amount to raise');
  }
};
Blockly.Blocks['number_of_raises'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number of raises");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('The number of raises');
  }
};
Blockly.Blocks['random'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("random amount");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('A random amount');
  }
};

/* Comparators */

Blockly.Blocks['greater_then'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(">");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(numcolor);
    this.setTooltip('True if and only if A is greater then B');
  }
};
Blockly.Blocks['greater_then_or_equal'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(">=");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(numcolor);
    this.setTooltip('True if and only if A is greater then or equal to B');
  }
};
Blockly.Blocks['less_then'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("<");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(numcolor);
    this.setTooltip('True if and only if A is less then B');
  }
};
Blockly.Blocks['less_then_or_equal'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("=<");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(numcolor);
    this.setTooltip('True if and only if A is less then or equal to B');
  }
};
Blockly.Blocks['equals'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("=");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(numcolor);
    this.setTooltip('True if and only if A equals B');
  }
};
Blockly.Blocks['and'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("and");
    this.appendValueInput("B")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('True if and only if A and B are both true');
  }
};
Blockly.Blocks['or'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("or");
    this.appendValueInput("B")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('True if and only if A or B is true');
  }
};
Blockly.Blocks['not'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("not");
    this.appendValueInput("A")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('True if and only if A is false');
  }
};

/* Operations */

var opcolor = numcolor;

Blockly.Blocks['add'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("+");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(opcolor);
    this.setTooltip('Results in A + B');
  }
};
Blockly.Blocks['substract'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("-");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(opcolor);
    this.setTooltip('Results in A - B');
  }
};
Blockly.Blocks['multiply'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("*");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(opcolor);
    this.setTooltip('Results in A * B');
  }
};
Blockly.Blocks['divide'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("/");
    this.appendValueInput("B")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(opcolor);
    this.setTooltip('Results in A / B');
  }
};

/* Actions */

var actcolor = 100;

Blockly.Blocks['poker_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("call");
    this.setPreviousStatement(true, "Action");
    this.setOutput(false, "Action");
    this.setColour(actcolor);
    this.setTooltip('Do action: call');
  }
};
Blockly.Blocks['poker_fold'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fold");
    this.setPreviousStatement(true, "Action");
    this.setColour(actcolor);
    this.setTooltip('Do action: fold');
  }
};
Blockly.Blocks['poker_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("raise");
    this.appendValueInput("amount")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "Action");
    this.setColour(actcolor);
    this.setTooltip('Do action: raise');
  }
};

/* Cards */

var rangecolor = 210;
var cardcolor = 20;

Blockly.Blocks['poker_cards'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("cards in ")
        .appendField(new Blockly.FieldDropdown([["hand", "handkaarten"], ["table", "tafelkaarten"], ["hand and table", "allekaarten"]]), "in");
    this.appendValueInput("cardlist")
        .setCheck("POKER_TYPE_CARD")
        .appendField("contains");
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(rangecolor);
    this.setTooltip('Whether there are cards with certain properties (you can drag multiple cards in to denote different cards)');
  }
};
Blockly.Blocks['poker_card'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("card with");
    this.appendValueInput("arg_color")
        .setCheck("POKER_TYPE_COLOR")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("color:");
    this.appendValueInput("arg_rank")
        .setCheck("POKER_TYPE_RANK")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("rank:");
    this.setOutput(true, "POKER_TYPE_CARD");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "POKER_TYPE_CARD");
    this.setNextStatement(true, "POKER_TYPE_CARD");
    this.setColour(cardcolor);
    this.setTooltip('declare properties of a specific card');
  }
};

/* Suits */

// Properties for the block construction.
var suitcolor = 110;
var allsuits = [["red", "red"], ["black", "black"]];
Blockly.Blocks['poker_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("color = ")
        .appendField(new Blockly.FieldDropdown(allsuits), "color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(suitcolor);
    this.setTooltip('Color is red (hearts, diamonds) or black (spades, clubs)');
  }
};
Blockly.Blocks['poker_color_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(suitcolor);
    this.setTooltip('Can be any suit of any color');
  }
};
Blockly.Blocks['poker_color_same'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same color (Group");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(suitcolor);
    this.setTooltip('cards with \'same color\' and same group number will match if they have the same color (e.g. each of them is red)');
  }
};

/* Rank */

var rankcolor = 330;

Blockly.Blocks['poker_rank'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rank ")
        .appendField(new Blockly.FieldDropdown([[">=", ">="], [">", ">"], ["<=", "=<"], ["<", "<"], ["=", "=:="], ["!=", "=\\="]]), "op")
        .appendField(new Blockly.FieldDropdown([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["Jack", "11"], ["Queen", "12"], ["King", "13"], ["Ace", "14"]]), "rank");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('whether the cards rank (value/symbol) satisfies the relation');
  }
};
Blockly.Blocks['poker_rank_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any rank");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('can be any rank (value/symbol)');
  }
};
Blockly.Blocks['poker_rank_same'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same rank (Group");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('cards with \'same rank\' and same group number will match if they have the same rank (e.g. each of them is an ace)');
  }
};
Blockly.Blocks['poker_rank_incr'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("same rank (Group");
    this.appendDummyInput()
        .appendField(") +");
    this.appendValueInput("incr")
        .setCheck("Number");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('use this to enforce increasing cards (+1, +2, +3, ...) for one group of \'same rank\' cards');
  }
};

/* Custom if statement */

Blockly.Blocks['custom_if'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('IF0')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .setCheck('Action')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true, 'Action');
    this.setNextStatement(true, 'Action');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  }
};
