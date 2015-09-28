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
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Prolog.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Prolog.functionNames_ = Object.create(null);
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Prolog.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.Prolog.definitions_) {
    definitions.push(Blockly.Prolog.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Prolog.definitions_;
  delete Blockly.Prolog.functionNames_;
  return definitions.join('\n\n') + '\n\n\n' + code;
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
/** BLOCKS: control **/

Blockly.Prolog['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Prolog.valueToCode(block, 'IF' + n,
      Blockly.Prolog.ORDER_NONE) || 'true';
  var branch = Blockly.Prolog.statementToCode(block, 'DO' + n) || 'fold';
  var code = 'do(' + branch + ', ' + (n+1) + ') :- ' + argument + '.';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Prolog.valueToCode(block, 'IF' + n,
        Blockly.Prolog.ORDER_NONE) || 'true';
    branch = Blockly.Prolog.statementToCode(block, 'DO' + n) || 'fold';
    code += 'do(' + branch + ', ' + (n+1) + ') :- ' + argument + '.';
  }
  if (block.elseCount_) {
    branch = Blockly.Prolog.statementToCode(block, 'ELSE');
    code += 'do(' + branch + ', ' + (n+2) + ') :- true.';
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

Blockly.Prolog['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Prolog.ORDER_ATOMIC];
};

/** BLOCKS: math **/

Blockly.Prolog['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.Prolog.ORDER_ATOMIC];
};

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

/** BLOCKS: poker **/

Blockly.Prolog['poker_call'] = function(block) {
  return 'call';
};

Blockly.Prolog['poker_fold'] = function(block) {
  return 'fold';
};

Blockly.Prolog['poker_raise'] = function(block) {
  // TODO actually: do(raise(X0), 1) :- X0 is 3.14, true.
  // here: do(raise(3.14), 1) :- true.
  var order = Blockly.Prolog.ORDER_ATOMIC;
  var argument0 = Blockly.Prolog.valueToCode(block, 'amount', order) || '0';
  var code = 'raise(' + argument0 + ')';
  return code;
};

Blockly.Prolog['poker_card_set'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Prolog into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Prolog.ORDER_NONE];
};

Blockly.Prolog['poker_card_in'] = function(block) {
  var value_nr = Blockly.Prolog.valueToCode(block, 'nr', Blockly.Prolog.ORDER_ATOMIC);
  var value_set = Blockly.Prolog.valueToCode(block, 'set', Blockly.Prolog.ORDER_ATOMIC);
  // TODO: Assemble Prolog into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Prolog.ORDER_NONE];
};

Blockly.Prolog['poker_card_suit'] = function(block) {
  var value_cardset = Blockly.Prolog.valueToCode(block, 'cardset', Blockly.Prolog.ORDER_ATOMIC);
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Prolog into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Prolog.ORDER_NONE];
};

Blockly.Prolog['poker_card_vale'] = function(block) {
  var value_cardset = Blockly.Prolog.valueToCode(block, 'cardset', Blockly.Prolog.ORDER_ATOMIC);
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Prolog into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Prolog.ORDER_NONE];
};

Blockly.Prolog['poker_card_valo'] = function(block) {
  var value_cardset = Blockly.Prolog.valueToCode(block, 'cardset', Blockly.Prolog.ORDER_ATOMIC);
  var dropdown_op = block.getFieldValue('OP');
  var value_value = Blockly.Prolog.valueToCode(block, 'value', Blockly.Prolog.ORDER_ATOMIC);
  // TODO: Assemble Prolog into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Prolog.ORDER_NONE];
};
