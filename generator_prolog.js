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
Blockly.Prolog.addReservedWords(
    'fuck');

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
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Prolog.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Prolog.functionNames_ = Object.create(null);
  // Create a dictionary for samevar and samecolor (reset in every poker_cards)
  Blockly.Prolog.cardsame_ = {};
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Prolog.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = ['red(h).','red(d).','black(c).','black(s).'];
  for (var name in Blockly.Prolog.definitions_) {
    definitions.push(Blockly.Prolog.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Prolog.definitions_;
  delete Blockly.Prolog.functionNames_;
  delete Blockly.Prolog.cardsame_;

  var frmt = code.split(', .').join('.').split(', )').join(')').trim();
  if (frmt[frmt.length - 1] != '.') {
    frmt += '.';
  }

  return definitions.join('\n') + '\n\n' + frmt;
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
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + ', ' + b + ')';
  return [code, order];
}
Blockly.Prolog['or'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  var code = '(' + a + '; ' + b + ')';
  return [code, order];
}
Blockly.Prolog['not'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
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
 * Unfinished advanced prolog formulations (for different blocks)
 *
Blockly.Prolog['poker_card_suit'] = function(block) {
  Blockly.Prolog.cardset_nr = -1;
  var X_cardset = Blockly.Prolog.valueToCode(block, 'cardset', Blockly.Prolog.ORDER_ATOMIC) || '_';
  var suit = block.getFieldValue('NAME');

  var t1 = Blockly.Prolog.newvar();
  var t2 = Blockly.Prolog.newvar();
  var t3 = Blockly.Prolog.newvar();
  var n = Blockly.Prolog.cardset_nr;
  var code = '';
  if (suit == 'same') {
    if (n == -1) {
      // all in list: // L=[(h,2),(h,3),(h,3)], [(Y,_)|T]=L, forall(member(X,T), X=(Y,_)).
      code = '[('+t1+',_)|'+t2+']='+X_cardset+', forall(member('+t3+','+t2+'), '+t3+'=('+t1+',_))';
    } else if (n > 1) {
      // 2 in list: // L=[(h,2),(f,3),(h,3)], member((Y,_), L), findall(true, member((Y,_), L), R), length(R,N), N >= 2, !.
      code = 'member(('+t1+',_), '+X_cardset+'), findall(true, member(('+t1+',_), '+X_cardset+'), '+t2+'), length('+t2+','+t3+'), '+t3+' >= '+n+', !';
    }
  } else { // one specific suit
    if (n == -1) {
      // all in list: // forall(member(X, [(h,2),(h,3),(h,3)]), X=(h,_)).
      code = 'forall(member('+t1+', '+X_cardset+'), '+t1+'=('+suit+',_))';
    } else if (n == 1) {
      // just one
      code = 'member(('+suit+',_), '+X_cardset+'), !';
    } else if (n > 1) {
      // 2 in list: // findall(true, member((h,_), [(h,2),(h,3),(f,3)]), R), length(R,N), N >= 2.
      code = 'findall(true, member(('+suit+',_), '+X_cardset+'), '+t1+'), length('+t1+','+t2+'), '+t2+' >= '+n;
    }
  }
  return [code, Blockly.Prolog.ORDER_NONE];
};

Blockly.Prolog['poker_card_valeq'] = function(block) {
  Blockly.Prolog.cardset_nr = -1;
  var X_cardset = Blockly.Prolog.valueToCode(block, 'cardset', Blockly.Prolog.ORDER_ATOMIC) || '_';
  var type = block.getFieldValue('NAME');

  var t1 = Blockly.Prolog.newvar();
  var t2 = Blockly.Prolog.newvar();
  var t3 = Blockly.Prolog.newvar();
  var n = Blockly.Prolog.cardset_nr;
  var code = '';
  if (type == 'same') { // same values
    if (n == -1) {
      // all in list: // L=[(h,3),(h,3),(h,3)], [(_,V)|T]=L, forall(member(X,T), X=(_,V)).
      code = '[(_,'+t1+')|'+t2+']='+X_cardset+', forall(member('+t3+','+t2+'), '+t3+'=(_,'+t1+'))';
    } else if (n > 1) {
      // 2 in list: // L=[(h,2),(f,3),(h,3)], member((_,V), L), findall(true, member((_,V), L), R), length(R,N), N >= 2, !.
      code = 'member((_,'+t1+'), '+X_cardset+'), findall(true, member((_,'+t1+'), '+X_cardset+'), '+t2+'), length('+t2+','+t3+'), '+t3+' >= '+n+', !';
    }
  } else { // increasing values
    if (n == -1) {
      var t4 = Blockly.Prolog.newvar();
      var t5 = Blockly.Prolog.newvar();
      var t6 = Blockly.Prolog.newvar();
      var t7 = Blockly.Prolog.newvar();
      // all in list: // L=[(h,4),(h,3),(h,5)], findall(V, member((_,V), L), Lv), sort(Lv,Ls), length(Ls,Ll), forall(nth1(I, Ls, V), (I =:= Ll;(I =\= Ll, I1 is I+1, V1 is V+1, nth1(I1, Ls, V1)))).
      code = 'findall('+t1+', member((_,'+t1+'), '+X_cardset+'), '+t2+'), sort('+t2+','+t3+'), length('+t3+','+t4+'), forall(nth1('+t5+', '+t3+', '+t1+'), ('+t5+' =:= '+t4+';('+t5+' =\\= '+t4+', '+t6+' is '+t5+'+1, '+t7+' is '+t1+'+1, nth1('+t6+', '+t3+', '+t7+'))))';
    } else if (n > 1) {
      // 3 in list: // L=[(h,4),(h,3),(h,5),(c,2)], member((_,V), L), forall((I=1;I=2;I=3), (VI is V+I, member((_,VI),L))), !. // Rather naieve...
      var myenum = '';
      for(var i=1; i<=n; i++) {
        myenum += 'I='+i;
        if (i != n)
          myenum += ';';
      }
      code = 'member((_,'+t1+'), '+X_cardset+'), forall(('+myenum+'), ('+t2+' is '+t1+'+I, member((_,'+t2+'),'+X_cardset+'))), !';
    }
  }
  return [code, Blockly.Prolog.ORDER_ATOMIC];
};

Blockly.Prolog['poker_card_valop'] = function(block) {
  var X_cardset = Blockly.Prolog.valueToCode(block, 'cardset', Blockly.Prolog.ORDER_NONE) || '_';
  var dropdown_op = block.getFieldValue('OP');
  var X_value = Blockly.Prolog.valueToCode(block, 'value', Blockly.Prolog.ORDER_NONE);

  var t1 = Blockly.Prolog.newvar();
  var n = Blockly.Prolog.cardset_nr;
  var code = '';
  if (n == -1) {
    // all in list: // L=[(f,2),(h,3),(h,5)], forall(member((_,V), L), V =< 5).
    code = 'forall(member((_,'+t1+'), '+X_cardset+'), '+t1+' '+dropdown_op+' '+X_value+')';
  } else if (n == 1) {
    code = 'member((_,'+t1+'), '+X_cardset+'), '+t1+' '+dropdown_op+' '+X_value+', !';
  } else if (n > 1) {
    var t2 = Blockly.Prolog.newvar();
    var t3 = Blockly.Prolog.newvar();
    var t4 = Blockly.Prolog.newvar();
    // 2 in list: // L=[(f,2),(h,3),(h,5)], findall(true, (member((_,V), L), V =< 4), R), length(R,N), N >= 2.
    code = 'findall(true, (member((_,'+t1+'), '+t2+'), '+t1+' '+dropdown_op+' '+X_value+'), '+t3+'), length('+t3+','+t4+'), '+t4+' >= '+n;
  }
  return [code, Blockly.Prolog.ORDER_NONE];
};
*/

/** BLOCKS: control **/

Blockly.Prolog['custom_if'] = function(block) {

  // Default code for the if statement. All statements will append to this.
  console.log('New if statement to be analyzed...');
  var code = '';

  // Analyze every 'if-do' statement (include if and else if's).
  for (var n=0; n <= block.elseifCount_; n++) {

    console.log('Process statement number ' + (n+1) + '...');


    // Fetch all the information about this specific if-statement.
    var argument = Blockly.Prolog.valueToCode(block, 'IF' + n, Blockly.Prolog.ORDER_NONE) || 'true';

    // Append the scope with the given argument if it is not ''.
    var scope = Blockly.Prolog.scope;
    if (scope != '') {
        console.log('Appending the argument to scope variable...');
        argument = scope + argument;
        Blockly.Prolog.scope = '';
    }
    console.log('Scope: '+ scope);

    var branch = Blockly.Prolog.statementToCode(block, 'DO' + n) || 'fold';
    console.log('Argument: ' + argument);
    console.log('Branch: ' + branch);



    // MAGIC HAPPENS HERE
    var stmts = branch.split('\n');
    if (stmts.length > 1)
      for(var i = 0; i < stmts.length-1; i++)
        if (stmts[i].length > 0)
          code += stmts[i].substring(0, stmts[i].length - 1)
          + ', '
          + argument
          + '.\n';
    branch = stmts[stmts.length - 1];
    // END MAGIC

    console.log('Code after splitting: ' + code);

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

/** BLOCKS: logic **/

Blockly.Prolog['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Prolog.ORDER_EQUALITY : Blockly.Prolog.ORDER_RELATIONAL;
  var argument0 = Blockly.Prolog.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Prolog.valueToCode(block, 'B', order) || '0';
  var code = '(' + argument0 + ' ' + operator + ' ' + argument1 + ')';
  return [code, order];
};

Blockly.Prolog['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? ',' : ';';
  var order = (operator == ',') ? Blockly.Prolog.ORDER_LOGICAL_AND :
      Blockly.Prolog.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Prolog.valueToCode(block, 'A', order);
  var argument1 = Blockly.Prolog.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == ',') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = '(' + argument0 + ' ' + operator + ' ' + argument1 + ')';
  return [code, order];
};

Blockly.Prolog['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Prolog.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Prolog.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '\\+(' + argument0 + ')';
  return [code, order];
};



/** BLOCKS: math **/



Blockly.Prolog['math_arithmetic'] = function(block) {
  // TODO: should be: X0 is 3.14, X1 is 3.15, X2 is (X0 + X1)
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.Prolog.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.Prolog.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.Prolog.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.Prolog.ORDER_DIVISION],
    'POWER': [null, Blockly.Prolog.ORDER_COMMA]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Prolog.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Prolog.valueToCode(block, 'B', order) || '0';
  var code;
  // Power in Prolog requires a special case since it has no operator.
  if (!operator) {
    code = 'pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Prolog.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};
