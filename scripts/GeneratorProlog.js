/**
 * Tias Guns, 2015
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

goog.provide('Blockly.Prolog');
goog.require('Blockly.Generator');

/**
 * Prolog-style code generator for pokerdemo.
 * @type {!Blockly.Generator}
 */
Blockly.Prolog = new Blockly.Generator('Prolog');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Prolog.addReservedWords('fuck');
Blockly.Prolog.INDENT = '';

/**
 * Order of operation ENUMs.
 * http://php.net/manual/en/language.operators.precedence.php
 */
Blockly.Prolog.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Prolog.ORDER_CLONE = 1;          // clone
Blockly.Prolog.ORDER_NEW = 1;            // new
Blockly.Prolog.ORDER_MEMBER = 2;         // ()
Blockly.Prolog.ORDER_FUNCTION_CALL = 2;  // ()
Blockly.Prolog.ORDER_INCREMENT = 3;      // ++
Blockly.Prolog.ORDER_DECREMENT = 3;      // --
Blockly.Prolog.ORDER_LOGICAL_NOT = 4;    // !
Blockly.Prolog.ORDER_BITWISE_NOT = 4;    // ~
Blockly.Prolog.ORDER_UNARY_PLUS = 4;     // +
Blockly.Prolog.ORDER_UNARY_NEGATION = 4; // -
Blockly.Prolog.ORDER_MULTIPLICATION = 5; // *
Blockly.Prolog.ORDER_DIVISION = 5;       // /
Blockly.Prolog.ORDER_MODULUS = 5;        // %
Blockly.Prolog.ORDER_ADDITION = 6;       // +
Blockly.Prolog.ORDER_SUBTRACTION = 6;    // -
Blockly.Prolog.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
Blockly.Prolog.ORDER_RELATIONAL = 8;     // < <= > >=
Blockly.Prolog.ORDER_IN = 8;             // in
Blockly.Prolog.ORDER_INSTANCEOF = 8;     // instanceof
Blockly.Prolog.ORDER_EQUALITY = 9;       // == != === !==
Blockly.Prolog.ORDER_BITWISE_AND = 10;   // &
Blockly.Prolog.ORDER_BITWISE_XOR = 11;   // ^
Blockly.Prolog.ORDER_BITWISE_OR = 12;    // |
Blockly.Prolog.ORDER_CONDITIONAL = 13;   // ?:
Blockly.Prolog.ORDER_ASSIGNMENT = 14;    // = += -= *= /= %= <<= >>= ...
Blockly.Prolog.ORDER_LOGICAL_AND = 15;   // &&
Blockly.Prolog.ORDER_LOGICAL_OR = 16;    // ||
Blockly.Prolog.ORDER_COMMA = 17;         // ,
Blockly.Prolog.ORDER_NONE = 99;          // (...)

/**
 * No variable initialisation needed
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Prolog.init = function(workspace) {
  // Init global rule counter (do(_,1):-, do(_,2):-,...)
  Blockly.Prolog.rulecounter = 1;
  // Init global variable-name counter (X1, X2, ...)
  Blockly.Prolog.varcounter = 1;
  // scope for 'and' expressions
  Blockly.Prolog.scope = '';
  // POKER_TYPE_CARDSET second return argument (nr of cards in set)
  Blockly.Prolog.cardset_nr = -1;
  // Create a dictionary for samevar and samecolor (reset in every poker_cards)
  Blockly.Prolog.cardsame_ = {};


};

// HACK: Helper function to filter a list.
Array.prototype.filter = function(checker) {
  var result = [];
  for(var i = 0; i < this.length; i++) {
    if (checker(this[i])) {
      result.push(this[i]);
    }
  }
  return result;
}

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Prolog.finish = function(code) {
  delete Blockly.Prolog.cardsame_;
  var frmt = code.split(', .').join('.').split(', )').join(')').split(', ,').join(', ').trim();
  if (frmt[frmt.length - 1] != '.' && frmt.length > 0) {
    frmt += '.';
  }
/*
  var elements = frmt.split('\n').filter(function(element) { return element.length > 0; });
  console.log(elements.join('\n'));
  var results = { inc:[], cor:[] }
  for(var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.indexOf('do') <= -1) {
      results.inc.push(element);
    } else {
      results.cor.push(element);
    }
  }
  var finals = results.cor;
  for(var i = 0; i < results.inc.length; i++) {
    var incorrect = results.inc[i];
    var statement = 'do(' + incorrect.substring(0, incorrect.length - 1) + ', ' + (results.cor.length + i + 1) + ') :- ' + Blockly.Prolog.scope + 'true.';
    finals.push(statement);
  }
  console.log('FINALS:');
  console.log(finals.join('\n'));*/
  return frmt;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Prolog.scrubNakedValue = function(line) {
  // actually, should not be output
  return;
};

/**
 * Encode a string as a properly escaped Prolog string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Prolog string.
 * @private
 */
Blockly.Prolog.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Prolog from blocks.
 * Ignores comments
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Prolog code created for this block.
 * @return {string} Prolog code with comments and subsequent blocks added.
 * @private
 */
Blockly.Prolog.scrub_ = function(block, code) {
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();

  // HACK: Parse next statements to if(true).

  console.log(code);
  console.log('---');
/*
  if (code)
    if (code.indexOf('do') <= -1) {
      code = 'do(' + code + ', ' + Blockly.Prolog.rulecounter + ') :- ' + Blockly.Prolog.scope + 'true.';
      Blockly.Prolog.rulecounter++;
      Blockly.Prolog.scope = '';
    }*/

  if (nextBlock) {
    console.log('next found');
    var parsed = Blockly.Prolog.blockToCode(nextBlock);
    if (parsed.indexOf('do') > -1) {
      return code + parsed;
    } else {
      var extra = 'do(' + parsed + ', ' + Blockly.Prolog.rulecounter + ') :- ' + Blockly.Prolog.scope + 'true.';
      Blockly.Prolog.rulecounter++;
      Blockly.Prolog.scope = '';
      return code + extra;
    }

  }

  return code + Blockly.Prolog.blockToCode(nextBlock);
};

/** BLOCKS **/
Blockly.Prolog.newvar = function() {
  var Xnew = 'X'+Blockly.Prolog.varcounter;
  Blockly.Prolog.varcounter += 1;
  return Xnew;
};

/**
 *  Implementation for blocks that represent BOOLEANS.
 *  i.e. is_preflop, is_turn, is_dealer, etc.
 */

Blockly.Prolog['is_preflop'] = function(block) {
  return ["ispreflop", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_flop'] = function(block) {
  return ["isflop", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_turn'] = function(block) {
 return ["isturn", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_river'] = function(block) {
 return ["isriver", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_postflop'] = function(block) {
 return ["ispostflop", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_small_blind'] = function(block) {
 return ["issmallblind", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_big_blind'] = function(block) {
 return ["isbigblind", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['is_dealer'] = function(block) {
 return ["isbutton", Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Prolog.ORDER_ATOMIC];
};

/**
 *  Implementation for blocks that represent NUMERIC values.
 *  i.e. stacksize, potsize, active players, etc.
 */

Blockly.Prolog['stacksize'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'saldo(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['potsize'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'potgrootte(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['active_players'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'actievespelers(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['non_allin_active_players'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'actievespelersmetgeld(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['amount_to_call'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'tekort(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['max_profit'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'maximalewinst(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['min_raise'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'minimumraise(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['max_raise'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'maximumraise(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['number_of_raises'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'aantalraises(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['random'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope += 'random(' + Xnew + '), ';
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['math_number'] = function(block) {
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.Prolog.ORDER_ATOMIC];
};

/**
 *  Implementation for blocks that represent COMPARISONS.
 *  i.e. greater_then, less_then, and, or, etc.
 */

Blockly.Prolog['greater_then'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + ' > ' + b + ')';
  return [code, order];
}
Blockly.Prolog['greater_then_or_equal'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + ' >= ' + b + ')';
  return [code, order];
}
Blockly.Prolog['less_then'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + ' < ' + b + ')';
  return [code, order];
}
Blockly.Prolog['less_then_or_equal'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + ' =< ' + b + ')';
  return [code, order];
}
Blockly.Prolog['equals'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + ' is ' + b + ')';
  return [code, order];
}
Blockly.Prolog['and'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 'true';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 'true';
  var code = '(' + a + ', ' + b + ')';
  return [code, order];
}
Blockly.Prolog['or'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 'true';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 'true';
  var code = '(' + a + '; ' + b + ')';
  return [code, order];
}
Blockly.Prolog['not'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 'false';
  var code = ' \\\+ ' + a + '';
  return [code, order];
}

/**
 *  Implementation for blocks that represent OPERATIONS.
 *  i.e. add, substract, multiple, etc.
 */

Blockly.Prolog['add'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  Blockly.Prolog.scope += Xnew + ' is ' + a + ' + ' + b + ', ';
  return [Xnew, order];
}
Blockly.Prolog['substract'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  Blockly.Prolog.scope += Xnew + ' is ' + a + ' - ' + b + ', ';
  return [Xnew, order];
}
Blockly.Prolog['multiply'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  Blockly.Prolog.scope += Xnew + ' is ' + a + ' * ' + b + ', ';
  return [Xnew, order];
}
Blockly.Prolog['divide'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  Blockly.Prolog.scope += Xnew + ' is ' + a + ' / ' + b + ', ';
  return [Xnew, order];
}

/**
 *  Implementation for blocks that represent ACTIONS.
 *  i.e. call, fold, raise.
 */

Blockly.Prolog['poker_call'] = function(block) {
  return 'call';
};
Blockly.Prolog['poker_fold'] = function(block) {
  return 'fold';
};
Blockly.Prolog['poker_raise'] = function(block) {
  // do(raise(X0), 1) :- X0 is 3.14, true.
  var Xnew = Blockly.Prolog.newvar();
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var argument0 = Blockly.Prolog.valueToCode(block, 'amount', order) || '0';
  var code = Xnew + ' is ' + argument0 + ', ';
  Blockly.Prolog.scope += code;
  return 'raise(' + Xnew + ')';
};

/**
 *  Implementation for blocks that control CARDS.
 */

// returns the var!
Blockly.Prolog['poker_cards'] = function(block) {
  // scope: cardset(X0), members([],X0)
  Blockly.Prolog.cardsame_ = {}; // reset hashtable for samevar and samecolor in this cardlist
  var Xnew = Blockly.Prolog.newvar();

  var cardset_name = block.getFieldValue('in');
  Blockly.Prolog.scope += cardset_name + '(' + Xnew + '), ';

  // put stuff generated by 'cardlist' after previous stuff
  var prevScope = Blockly.Prolog.scope;
  Blockly.Prolog.scope = '';

  var cardlist = Blockly.Prolog.statementToCode(block, 'cardlist') || '_';
  var l = cardlist.length;
  // cut of spurious ', ' at end if exists
  if (l >= 2 && cardlist.charAt(l-1) == ' ' && cardlist.charAt(l-2) == ',')
    cardlist = cardlist.substr(0,l-2);
  var code = 'members(['+cardlist+'],'+Xnew+'), ';

  Blockly.Prolog.scope = prevScope + code + Blockly.Prolog.scope;

  return ['', Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_card'] = function(block) {
  // return: card(Xrank,Xcolor)
  var Xcolor = Blockly.Prolog.valueToCode(block, 'arg_color', Blockly.Prolog.ORDER_ATOMIC) || '_';
  var Xrank = Blockly.Prolog.valueToCode(block, 'arg_rank', Blockly.Prolog.ORDER_ATOMIC) || '_';
  return 'card(' + Xrank + ',' + Xcolor + '), ';
};
Blockly.Prolog['poker_color'] = function(block) {
  // return: X0
  // scope: red(X0)
  var Xnew = Blockly.Prolog.newvar();

  var color_name = block.getFieldValue('color');
  var code = color_name + '(' + Xnew + '), ';
  Blockly.Prolog.scope += code;

  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_color_any'] = function(block) {
  return ['_', Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_color_same'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var groupnum = Blockly.Prolog.valueToCode(block, 'num', order) || '0';
  var cardsame_group = 'color'+groupnum;

  if (!Blockly.Prolog.cardsame_[cardsame_group])
    Blockly.Prolog.cardsame_[cardsame_group] = Blockly.Prolog.newvar();

  var Xvar = Blockly.Prolog.cardsame_[cardsame_group];
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank'] = function(block) {
  // scope: X0 => 14,
  var Xnew = Blockly.Prolog.newvar();

  var arg_op = block.getFieldValue('op');
  var arg_rank = block.getFieldValue('rank');

  var code = Xnew + ' ' + arg_op + ' ' + arg_rank + ', ';
  Blockly.Prolog.scope += code;

  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank_any'] = function(block) {
  return ['_', Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank_same'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var groupnum = Blockly.Prolog.valueToCode(block, 'num', order) || '0';
  var cardsame_group = 'rank'+groupnum;

  if (!Blockly.Prolog.cardsame_[cardsame_group])
    Blockly.Prolog.cardsame_[cardsame_group] = Blockly.Prolog.newvar();

  var Xvar = Blockly.Prolog.cardsame_[cardsame_group];
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank_incr'] = function(block) {
  // scope: X0 is Xgrp + 1,
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var groupnum = Blockly.Prolog.valueToCode(block, 'num', order) || '0';
  var cardsame_group = 'rank'+groupnum;

  if (!Blockly.Prolog.cardsame_[cardsame_group])
    Blockly.Prolog.cardsame_[cardsame_group] = Blockly.Prolog.newvar();

  var Xvar = Blockly.Prolog.cardsame_[cardsame_group];

  var incrval = Blockly.Prolog.valueToCode(block, 'incr', order) || '0';
  if (incrval != '0') {
    var Xnew = Blockly.Prolog.newvar();
    var code = Xnew + ' is ' + Xvar + ' + ' + incrval + ', ';
    Blockly.Prolog.scope += code;
    Xvar = Xnew; // for in return
  }
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
};

/**
 *  Implementation for the custom if block.
 */

Blockly.Prolog['custom_if'] = function(block) {
  var code = '';
  for (var n=0; n <= block.elseifCount_; n++) {
    var argument = Blockly.Prolog.valueToCode(block, 'IF' + n, Blockly.Prolog.ORDER_NONE) || 'true';
    var scope = Blockly.Prolog.scope;
    if (scope != '') {
        argument = scope + argument;
        Blockly.Prolog.scope = '';
    }
    var branch = Blockly.Prolog.statementToCode(block, 'DO' + n) || 'fold';
    argument += ', ' + Blockly.Prolog.scope;
    var stmts = branch.split('\n');
    if (stmts.length > 1)
      for(var i = 0; i < stmts.length-1; i++)
        if (stmts[i].length > 0)
          code += stmts[i].substring(0, stmts[i].length - 1)
          + ', '
          + argument
          + '.\n';
    branch = stmts[stmts.length - 1];
    code += 'do(' + branch + ', ' + Blockly.Prolog.rulecounter + ') :- ' + argument + '.\n';
    Blockly.Prolog.rulecounter++;
  }
  if (block.elseCount_) {
    var branch = Blockly.Prolog.statementToCode(block, 'ELSE') || 'fold';
    var argument = 'true';
    var scope = Blockly.Prolog.scope;
    if (scope != '') {
        argument = scope;
        Blockly.Prolog.scope = '';
    }
    code += 'do(' + branch + ', ' + Blockly.Prolog.rulecounter + ') :- ' + argument + '.\n';
    Blockly.Prolog.rulecounter++;
  }
  return code + '\n';
};
