
var Utils = {

  xmlToString: function(xmlData) {
      var xmlString;
      if (window.ActiveXObject) {
          xmlString = xmlData.xml;
      } else {
          xmlString = (new XMLSerializer()).serializeToString(xmlData);
      }
      return xmlString;
  },

  equalBlocks: function(a, b) {
    var ca = this.clean(a), cb = this.clean(b);
    return ca === cb;
  },

  cleanBlock: function(a) {
    var noX = a.replace(/x="(-)*[0-9]*"/g, '');
    var noY = noX.replace(/y="(-)*[0-9]*"/g, '');
    return noY.replace(/(\r\n|\n|\r|\t| )/gm,"");
  }

};
