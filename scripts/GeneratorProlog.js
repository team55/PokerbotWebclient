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
  // POKER_TYPE_CARDSET second return argument (nr of cards in set)
  Blockly.Prolog.cardset_nr = -1;
  // Create a dictionary for samevar and samecolor (reset in every poker_cards)
  Blockly.Prolog.cardsame_ = {};
  // Scope became an instance, see Scope.js documentation for more info.
  Blockly.Prolog.scope = ScopeInstance;
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
  var frmt = code.split(', .').join('.').split(', )').join(')').split(', ,').join(', ').split(', ;').join(';').trim();
  if (frmt[frmt.length - 1] != '.' && frmt.length > 0) {
    frmt += '.';
  }
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
 * Generate code for all blocks in the workspace to the specified language.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 * @return {string} Generated code.
 */
Blockly.Generator.prototype.workspaceToCode = function(workspace) {
  if (!workspace) {
    // Backwards compatibility from before there could be multiple workspaces.
    console.warn('No workspace specified in workspaceToCode call.  Guessing.');
    workspace = Blockly.getMainWorkspace();
  }
  var code = [];
  this.init(workspace);
  var blocks = workspace.getTopBlocks(true);
  for (var x = 0, block; block = blocks[x]; x++) {
    var line = this.blockToCode(block);
    if (goog.isArray(line)) {
      // Value blocks return tuples of code and operator order.
      // Top-level blocks don't care about operator order.
      line = line[0];
    }
    if (line) {
      if (block.outputConnection && this.scrubNakedValue) {
        // This block is a naked value.  Ask the language's code generator if
        // it wants to append a semicolon, or something.
        line = this.scrubNakedValue(line);
      }

    }
    if (line) {

      // HACK: Here we format invalid PROLOG code.
      var rules = line.split('\n');
      var parsedRules = [];
      for(var i = 0; i < rules.length; i++) {
        if (rules[i].trim().length > 0) {
          if (rules[i].indexOf('do') <= -1) {
            var allowed = ['poker_call', 'poker_raise', 'poker_fold', 'custom_if'];
            if(allowed.indexOf(block.type) > -1) {
              var value = 'fold';
              if (rules[i].length > 0) value = rules[i];
              var newline = 'do(' + value + ', ' + Blockly.Prolog.rulecounter + ') :- ' + Blockly.Prolog.scope.build() + '.';
              Blockly.Prolog.rulecounter++;
              parsedRules.push(newline);
            } else {
              Blockly.Prolog.scope.build();
            }
          } else {
            parsedRules.push(rules[i]);
          }
        }
      }
      for(var j = 0; j < parsedRules.length; j++) {
        var frmt = parsedRules[j].split(', .').join('.').split(', )').join(')').split(', ,').join(', ').split(', ;').join(';').trim();
        if (frmt[frmt.length - 1] != '.' && frmt.length > 0) { frmt += '.'; }
        parsedRules[j] = frmt;
      }
      line = parsedRules.join('\n');


      code.push(line);
    }
  }
  code = code.join('\n');  // Blank line between each section.
  code = this.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
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
  Blockly.Prolog.scope.addFact('saldo(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['potsize'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('potgrootte(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['active_players'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('actievespelers(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['non_allin_active_players'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('actievespelersmetgeld(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['amount_to_call'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('tekort(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['max_profit'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('maximalewinst(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['min_raise'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('minimumraise(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['max_raise'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('maximumraise(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['number_of_raises'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('aantalraises(' + Xnew + ')');
  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
}
Blockly.Prolog['random'] = function(block) {
  var Xnew = Blockly.Prolog.newvar();
  Blockly.Prolog.scope.addFact('random(' + Xnew + ')');
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
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  var code = '(' + a + ' > ' + b + ')';
  return [code, order];
}
Blockly.Prolog['greater_then_or_equal'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  var code = '(' + a + ' >= ' + b + ')';
  return [code, order];
}
Blockly.Prolog['less_then'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  var code = '(' + a + ' < ' + b + ')';
  return [code, order];
}
Blockly.Prolog['less_then_or_equal'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  var code = '(' + a + ' =< ' + b + ')';
  return [code, order];
}
Blockly.Prolog['equals'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
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
  var code = '((' + a + '); (' + b + '))';
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
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  Blockly.Prolog.scope.addFact(Xnew + ' is ' + a + ' + ' + b);
  return [Xnew, order];
}
Blockly.Prolog['substract'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  Blockly.Prolog.scope.addFact(Xnew + ' is ' + a + ' - ' + b);
  return [Xnew, order];
}
Blockly.Prolog['multiply'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 0;
  Blockly.Prolog.scope.addFact(Xnew + ' is ' + a + ' * ' + b);
  return [Xnew, order];
}
Blockly.Prolog['divide'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xnew = Blockly.Prolog.newvar();
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || 0;
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || 1;
  Blockly.Prolog.scope.addFact(Xnew + ' is ' + a + ' / ' + b);
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
  Blockly.Prolog.scope.addFact(Xnew + ' is ' + argument0);
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
  Blockly.Prolog.scope.addFact(cardset_name + '(' + Xnew + ')');

  // put stuff generated by 'cardlist' after previous stuff
  var prevScope = Blockly.Prolog.scope.build();

  var cardlist = Blockly.Prolog.statementToCode(block, 'cardlist') || '_';
  var l = cardlist.length;
  // cut of spurious ', ' at end if exists
  if (l >= 2 && cardlist.charAt(l-1) == ' ' && cardlist.charAt(l-2) == ',')
    cardlist = cardlist.substr(0,l-2);

  var code = 'members(['+cardlist+'],'+Xnew+')';

  var finaloutput = prevScope + ', ' + code + ', ' + Blockly.Prolog.scope.build();

  return [finaloutput, Blockly.Prolog.ORDER_ATOMIC];
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
  Blockly.Prolog.scope.addFact(color_name + '(' + Xnew + ')');

  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_color_any'] = function(block) {
  return ['_', Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_color_same'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var groupnum = block.getFieldValue('num') || '0';
  var cardsame_group = 'color'+groupnum;

  if (!Blockly.Prolog.cardsame_[cardsame_group]) {
    var newVar = Blockly.Prolog.newvar();
    for (var key in Blockly.Prolog.cardsame_) {
      Blockly.Prolog.scope.addFact(Blockly.Prolog.cardsame_[key] + ' \\= ' + newVar);
    }
    Blockly.Prolog.cardsame_[cardsame_group] = newVar;
  }

  var Xvar = Blockly.Prolog.cardsame_[cardsame_group];
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
};

Blockly.Prolog['poker_rank'] = function(block) {
  // scope: X0 => 14,
  var Xnew = Blockly.Prolog.newvar();

  var arg_op = block.getFieldValue('op');
  var arg_rank = block.getFieldValue('rank');

  var code = Xnew + ' ' + arg_op + ' ' + arg_rank;
  Blockly.Prolog.scope.addFact(code);

  return [Xnew, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank_any'] = function(block) {
  return ['_', Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank_same'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var groupnum = block.getFieldValue('num') || '0';
  var cardsame_group = 'rank'+groupnum;

  if (!Blockly.Prolog.cardsame_[cardsame_group]) {
    var newVar = Blockly.Prolog.newvar();
    for (var key in Blockly.Prolog.cardsame_) {
      Blockly.Prolog.scope.addFact(Blockly.Prolog.cardsame_[key] + ' \\= ' + newVar);
    }
    Blockly.Prolog.cardsame_[cardsame_group] = newVar;
  }

  var Xvar = Blockly.Prolog.cardsame_[cardsame_group];
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
};
Blockly.Prolog['poker_rank_incr'] = function(block) {
  // scope: X0 is Xgrp + 1,
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var groupnum = block.getFieldValue('num')  || '0';
  var cardsame_group = 'rank'+groupnum;

  if (!Blockly.Prolog.cardsame_[cardsame_group])
    Blockly.Prolog.cardsame_[cardsame_group] = Blockly.Prolog.newvar();

  var Xvar = Blockly.Prolog.cardsame_[cardsame_group];

  var incrval = Blockly.Prolog.valueToCode(block, 'incr', order) || '0';
  if (incrval != '0') {
    var Xnew = Blockly.Prolog.newvar();
    var code = Xnew + ' is ' + Xvar + ' + ' + incrval;
    Blockly.Prolog.scope.addFact(code);
    Xvar = Xnew; // for in return
  }
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
};

Blockly.Prolog['poker_rank_and'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var a = Blockly.Prolog.valueToCode(block, 'A', order) || '_';
  var b = Blockly.Prolog.valueToCode(block, 'B', order) || '_';
  //Blockly.Prolog.scope = a + ' = ' + b + ', ' + Blockly.Prolog.scope;
  Blockly.Prolog.scope.addFact(a + ' = ' + b);
  if (a === '_') { return [b, order]; }
  return [a, order];
}
Blockly.Prolog['poker_rank_plus'] = function(block) {
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var Xvar = Blockly.Prolog.valueToCode(block, 'A', order)  || '0';
  var incrval = Blockly.Prolog.valueToCode(block, 'B', order) || '0';
  if (incrval != '0') {
    var Xnew = Blockly.Prolog.newvar();
    var code = Xnew + ' is ' + Xvar + ' + ' + incrval;
    Blockly.Prolog.scope.addFact(code);
    Xvar = Xnew; // for in return
  }
  return [Xvar, Blockly.Prolog.ORDER_ATOMIC];
}

/**
 *  Implementation for the custom if block.
 */

Blockly.Prolog['custom_if'] = function(block) {
  var code = '';
  for (var n = 0; n <= block.elseifCount_; n++) {

    // Check the CONDITION
    var order = Blockly.Prolog.ORDER_NONE;
    var condition = Blockly.Prolog.valueToCode(block, 'IF0', order) || 'true';
    var scope = Blockly.Prolog.scope.build();
    if (scope != 'true') { condition = condition + ', '+ scope; }               // XXX: Order issue might be here. Changed it
                                                                                //      from scope + condition to condition + scope.

    // Fix the BRANCH
    var branch = Blockly.Prolog.statementToCode(block, 'DO0') || 'fold';
    var scope = Blockly.Prolog.scope.build();
    if (scope != 'true') { condition = condition + ', ' + scope; }


    // The BRANCH can be complex.
    // We check the branch line per line and add the current condition.
    // Except for the last one: this one should be converted because it will be
    // an action.
    var index = 0, lines = branch.split('\n');
    lines.forEach(function(line) {
      if (++index < lines.length && line.length > 0)
        code += line.substring(0, line.length - 1) + ', ' + condition + '.\n';
    });
    var action = lines[lines.length - 1] ? lines[lines.length - 1] : 'fold';
    code += 'do(' + action + ', ' + Blockly.Prolog.rulecounter + ') ';
    code += ':- ' + condition + '.\n';
    Blockly.Prolog.rulecounter++;

  }
  if (block.elseCount_) {
    var branch = Blockly.Prolog.statementToCode(block, 'ELSE') || 'fold';
    var argument = 'true';
    var scope = Blockly.Prolog.scope.toString();
    if (scope != '') {
        argument = scope;
        Blockly.Prolog.scope.build();
    }
    code += 'do(' + branch + ', ' + Blockly.Prolog.rulecounter + ') :- ' + argument + '.\n';
    Blockly.Prolog.rulecounter++;
  }
  Blockly.Prolog.scope.build();
  return code + '\n';
};
