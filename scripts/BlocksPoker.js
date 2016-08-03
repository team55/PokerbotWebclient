
/* Booleans */

var boolcolor = 210;

Blockly.Blocks['is_preflop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is preflop");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer de flop nog niet gedeeld is.');
  }
};
Blockly.Blocks['is_flop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is flop");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer de flop gedeeld is, maar de turn of river nog niet.');
  }
};
Blockly.Blocks['is_turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is turn");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer de turn gedeeld is, maar de river nog niet.');
  }
};
Blockly.Blocks['is_river'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is river");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer de river gedeeld is.');
  }
};
Blockly.Blocks['is_postflop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is postflop");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer de flop al gedeeld is.');
  }
};
Blockly.Blocks['is_small_blind'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is small blind");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer je small blind bent.');
  }
};
Blockly.Blocks['is_big_blind'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is big blind");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer je big blind bent.');
  }
};
Blockly.Blocks['is_dealer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is deler");
    this.setOutput(true, "Boolean");
    this.setColour(boolcolor);
    this.setTooltip('Is "true" wanneer je de deler bent.');
  }
};

/* Numeric */

var numcolor = 230;

Blockly.Blocks['stacksize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stackgrootte");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Het aantal chips dat voor jou ligt.');
  }
};
Blockly.Blocks['potsize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("potgrootte");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('De grootte van de pot.');
  }
};
Blockly.Blocks['active_players'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("aantal actieve spelers");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Het aantal actieve spelers die na jou aan beurt komen.');
  }
};
Blockly.Blocks['non_allin_active_players'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("aantal actieve spelers (niet all-in)");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Het aantal actieve spelers die na jou aan beurt komen en niet all-in zijn.');
  }
};
Blockly.Blocks['amount_to_call'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("hoeveelheid om te callen");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('De hoeveelheid om te callen.');
  }
};
Blockly.Blocks['max_profit'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("maximale winst");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('De maximale winst die je in deze handen kan binnenhalen.');
  }
};
Blockly.Blocks['min_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("minimale raise");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Het aantal chips waar de raise groter of gelijk aan moet zijn.');
  }
};
Blockly.Blocks['max_raise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("maximale raise");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Maximale raisehoeveelheid.');
  }
};
Blockly.Blocks['number_of_raises'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("aantal raises");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Het aantal voorgaande raises.');
  }
};
Blockly.Blocks['random'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("willekeurig");
    this.setOutput(true, "Number");
    this.setColour(numcolor);
    this.setTooltip('Een willekeurig genomen hoeveelheid.');
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
    this.setTooltip('Enkel "true" wanneer het eerste getal strikt groter is dan het tweede.');
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
    this.setTooltip('Enknel "true" wanneer het eerste getal groter dan of gelijk aan het tweede is.');
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
    this.setTooltip('Enkel "true" wanneer het eerste getal strikt kleiner is dan het tweede.');
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
    this.setTooltip('Enkel "true" wanneer het eerste getal kleiner of gelijk is aan het tweede getal.');
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
    this.setTooltip('Enkel "true" indien beide getallen aan elkaar gelijk zijn.');
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
    this.setTooltip('Enkel "true" indien zowel aan de linkse als de rechtse voorwaarde voldaan zijn.');
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
    this.setTooltip('Enkel "true" indien aan de linkse of de rechtse voorwaarde voldaan is.');
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
    this.setTooltip('Enkel "true" indien de gegeven voorwaarde "false" is.');
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
    this.setTooltip('Resulteert in de som van beide getallen.');
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
    this.setTooltip('Resulteert in het verschil van beide getallen.');
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
    this.setTooltip('Resulteert in de vermenigvuldiging van beide getallen.');
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
    this.setTooltip('Resulteert in het quotient van beide getallen.');
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
    this.setTooltip('Voer de actie "call" uit.');
  }
};
Blockly.Blocks['poker_fold'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fold");
    this.setPreviousStatement(true, "Action");
    this.setColour(actcolor);
    this.setTooltip('Voer de actie "fold" uit.');
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
    this.setTooltip('Voer de actie "raise" uit met het gegeven getal.');
  }
};

/* Cards */

var rangecolor = 210;
var cardcolor = 20;

Blockly.Blocks['poker_cards'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("kaarten in ");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldDropdown([["hand", "handkaarten"], ["tafel", "tafelkaarten"], ["hand of tafel", "allekaarten"]]), "in");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(' bevatten');
    this.appendStatementInput('cardlist')
        .setCheck('POKER_TYPE_CARD');
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(rangecolor);
    this.setTooltip('Gaat na indien de gegeven kaarten in de hand, op tafel, of in beide zitten.');
  }
};
Blockly.Blocks['poker_card'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("kaart met ");
    this.appendValueInput("arg_color")
        .setCheck("POKER_TYPE_COLOR")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("kleur:");
    this.appendValueInput("arg_rank")
        .setCheck("POKER_TYPE_RANK")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("rang:");
    this.setOutput(false, "POKER_TYPE_CARD");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "POKER_TYPE_CARD");
    this.setNextStatement(true, "POKER_TYPE_CARD");
    this.setColour(cardcolor);
    this.setTooltip('Definieert een kaart met gegeven rang en kleur.');
  }
};

/* Suits */

// Properties for the block construction.
var suitcolor = 110;
var allsuits = [["red", "red"], ["black", "black"]];
/*
Blockly.Blocks['poker_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("kleur = ")
        .appendField(new Blockly.FieldDropdown(allsuits), "color");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(suitcolor);
    this.setTooltip('Een kleur kan rood of zwart zijn.');
  }
};
*/
Blockly.Blocks['poker_color_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("elke kleur");
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(suitcolor);
    this.setTooltip('Kan eender welke kleur zijn.');
  }
};
Blockly.Blocks['poker_color_same'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("zelfde kleur (Groep")
        .appendField(new Blockly.FieldDropdown([["A", "A"], ["B", "2"], ["C", "3"], ["D", "4"]]), "num");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_COLOR");
    this.setColour(suitcolor);
    this.setTooltip('Kaarten waarvan de kleur tot eenzelfde groep behoord, zullen dezelfde kleur moeten hebben!');
  }
};

/* Rank */

var rankcolor = 330;

Blockly.Blocks['poker_rank'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rang ")
        .appendField(new Blockly.FieldDropdown([[">=", ">="], [">", ">"], ["<=", "=<"], ["<", "<"], ["=", "=:="], ["!=", "=\\="]]), "op")
        .appendField(new Blockly.FieldDropdown([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["Boer", "11"], ["Vrouw", "12"], ["Koning", "13"], ["Aas", "14"]]), "rank");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('Zorgt er voor dat de rang van de kaart voldoet aan de gegeven vergelijking.');
  }
};
Blockly.Blocks['poker_rank_any'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("elke rang");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('Kan eender welke rang zijn.');
  }
};
Blockly.Blocks['poker_rank_same'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("zelfde rang (Groep")
        .appendField(new Blockly.FieldDropdown([["A", "A"], ["B", "2"], ["C", "3"], ["D", "4"]]), "num");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('Kaarten waarvan de rang tot eenzelfde groep behoord, zullen dezelfde rang moeten hebben!');
  }
};
Blockly.Blocks['poker_rank_incr'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number")
        .appendField("zelfde rang (Groep");
    this.appendDummyInput()
        .appendField(") +");
    this.appendValueInput("incr")
        .setCheck("Number");
    this.setOutput(true, "POKER_TYPE_RANK");
    this.setColour(rankcolor);
    this.setTooltip('Kan gebruikt worden om opeenvolgende kaarten te definieren.');
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
