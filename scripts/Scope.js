
/**
 * A scope instance to make is easier to work with a scope in the Prolog code
 * generation process of Blocky.
 */
var ScopeInstance = {

  facts_: [],

  sortedFacts_: function() {
    var sorted = [];
    for (var i = 0; i < this.facts_.length; i++)
      if (this.facts_[i].indexOf('=') > -1) {
        sorted.unshift(this.facts_[i]);
      } else { sorted.push(this.facts_[i]); }
    return sorted;
  },
  clean: function() { this.facts_ = []; },

  /**
   * Makes it possible to add a fact to the scope. If the fact is already in
   * the scope, it won't be added again and a warning will be displayed saying
   * that you wanted to add a fact more than once.
   * @param   fact    The fact to add to the scope instance.
   */
  addFact: function(fact) {
    if (this.facts_.indexOf(fact) <= -1) {
      this.facts_.push(fact);
    } else { console.warn('Trying to add fact twice to scope: ' + fact); }
  },

  /**
   * Makes it possible to remove a fact from the scope. If the fact is not in
   * the scope yet, a warning will be displayed saying that you try to remove a
   * fact that is unexistent.
   * @param   fact    The fact to remove from the scope.
   */
  removeFact: function(fact) {
    var index = this.facts_.indexOf(fact);
    if (index > -1) {
      this.facts_.splice(index, 1);
    } else { console.warn('Trying to remove an unexistent fact: ' + fact); };
  },

  /**
   * Converts the ScopeInstance to a string so it can be used straight into the
   * Prolog code generation. Before the code is converted, the list will be
   * sorted.
   */
  toString: function() {
    if (this.facts_.length < 1) return 'true';
    var sorted = this.sortedFacts_();
    var initial = '' + sorted[0];
    for(var i = 1; i < sorted.length; i++) initial += ', ' + sorted[i];
    return initial;
  },

  /**
   * Returns a string representation of this scope and clears the current list
   * of facts. This way it can be used to create in the Blockly code generation
   * process.
   */
  build: function() {
    var result = this.toString();
    this.clean();
    return result;
  },

};
