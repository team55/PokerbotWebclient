
/**
 * Used to calculate statistics of the player.
 */
var STATSCALCULATOR = {

  /**
   * Calculates VPIP of stats.
   * Stats should have properties checks, calls, raises and folds.
   * If the provided data structure is invalid, return -1.
   */
  calculateVPIP: function(stats) {
    try {
      var top = stats.checks + stats.calls + stats.raises;
      var bot = top + stats.folds;
      return top/bot;
    } catch (exception) { return -1; }
  },

  /**
   * Calcualtes PFR of stats.
   * Stats should have properties checks, calls, raises and folds.
   * If the provided data structure is invalid, return -1.
   */
  calculatePFR: function(stats) {
    try {
      var top = stats.raises;
      var bot = top + stats.checks + stats.call + stats.folds;
      return top/bot;
    } catch (exception) { return -1; }
  }

};
