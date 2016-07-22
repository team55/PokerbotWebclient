
var BlockChecker = {

  equals: function(a, b) {
    var ca = this.clean(a), cb = this.clean(b);
    console.log(ca);
    console.log(cb);
    console.log(ca === cb);
    console.log('---------------');
    return ca === cb;
  },

  clean: function(a) {
    var noX = a.replace(/x="(-)*[0-9]*"/g, '');
    var noY = noX.replace(/y="(-)*[0-9]*"/g, '');
    return noY.replace(' ', '');
  }

}
