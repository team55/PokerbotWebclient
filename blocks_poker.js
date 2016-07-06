
/* Booleans */

Blockly.Blocks['is_preflop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is preflop");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if flop is unseen');
  }
};
Blockly.Blocks['is_flop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is flop");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if we are on the flop');
  }
};
Blockly.Blocks['is_turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is turn");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if we are on the turn');
  }
};
Blockly.Blocks['is_river'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is river");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if we are on the river');
  }
};
Blockly.Blocks['is_postflop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is postflop");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks the flop is seen');
  }
};
Blockly.Blocks['is_small_blind'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is small blind");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if we are in the small blind');
  }
};
Blockly.Blocks['is_big_blind'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is big blind");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if we are in the big blind');
  }
};
Blockly.Blocks['is_dealer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is dealer");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip('Checks if we are the dealer');
  }
};

/* Numeric */

Blockly.Blocks['stacksize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stacksize");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('Your current stacksize');
  }
};
Blockly.Blocks['potsize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("potsize");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The current potsize');
  }
};
Blockly.Blocks['active_players'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number of active players");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The number of active players');
  }
};
Blockly.Blocks['non_allin_active_players'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number of active players (not all-in)");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The number of active players (not all-in)');
  }
};
Blockly.Blocks['amount_to_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("amount to call");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The amount to call');
  }
};
Blockly.Blocks['max_profit'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("maximum profit");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The maximum profit for this hand');
  }
};
Blockly.Blocks['min_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("the minimum amount to raise");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The minimum amount to raise');
  }
};
Blockly.Blocks['max_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("maximum amount to raise");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The maximum amount to raise');
  }
};
Blockly.Blocks['number_of_raises'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("number of raises");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip('The number of raises');
  }
};
Blockly.Blocks['random'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("random amount");
    this.setOutput(true, "Number");
    this.setColour(230);
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
    this.setColour(190);
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
    this.setColour(190);
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
    this.setColour(190);
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
    this.setColour(190);
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
    this.setColour(190);
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
    this.setColour(240);
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
    this.setColour(240);
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
    this.setColour(240);
    this.setTooltip('True if and only if A is false');
  }
};

/* Operations */

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
    this.setColour(190);
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
    this.setColour(190);
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
    this.setColour(190);
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
    this.setColour(190);
    this.setTooltip('Results in A / B');
  }
};

/* Actions */

Blockly.Blocks['poker_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("call");
    this.setPreviousStatement(true, "Action");
    this.setOutput(false, "Action");
    this.setColour(120);
    this.setTooltip('Do action: call');
  }
};
Blockly.Blocks['poker_fold'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fold");
    this.setPreviousStatement(true, "Action");
    this.setColour(120);
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
    this.setColour(135);
    this.setTooltip('Do action: raise');
  }
};

/* Cards */

Blockly.Blocks['poker_cards'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("cards in ")
        .appendField(new Blockly.FieldDropdown([["hand", "handkaarten"], ["table", "tafelkaarten"], ["hand and table", "allekaarten"]]), "in");
    this.appendValueInput("cardlist")
        .setCheck("POKER_TYPE_CARD")
        .appendField("contains the following cards");
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(210);
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
    this.setColour(20);
    this.setTooltip('declare properties of a specific card');
  }
};

/**
 *  Blocks used to define the SUITS of the cards. Possibilities are
 *  specific, any or 'variable'.
 *  TODO: Work out a better way to handle the variable suits.
 */

// Properties for the block construction.
var allsuits = [["red", "red"], ["black", "black"]];
Blockly.Blocks['poker_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("color = ")
        .appendField(new Blockly.FieldDropdown(allsuits), "color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(110);
    this.setTooltip('Color is red (hearts, diamonds) or black (spades, clubs)');
  }
};
Blockly.Blocks['poker_color_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("any color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(210);
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
    this.setColour(210);
    this.setTooltip('cards with \'same color\' and same group number will match if they have the same color (e.g. each of them is red)');
  }
};

/**
 *  Blocks used to define the RANKS of the cards. Possibilities are
 *  specific, any, incremental or 'variable'.
 *  TODO: Work out a better way to handle the variable ranks.
 */

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
        .appendField("same rank (Group");
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
        .appendField("same rank (Group");
    this.appendDummyInput()
        .appendField(") +");
    this.appendValueInput("incr")
        .setCheck("Number");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(330);
    this.setTooltip('use this to enforce increasing cards (+1, +2, +3, ...) for one group of \'same rank\' cards');
  }
};

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
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
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
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = workspace.newBlock('controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = workspace.newBlock('controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case 'controls_if_else':
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.elseifCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSE');
    }
    var i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  }
};
