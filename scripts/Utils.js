
var Utils = {
  xmlToString: function(xmlData) {

      var xmlString;
      //IE
      if (window.ActiveXObject){
          xmlString = xmlData.xml;
      }
      // code for Mozilla, Firefox, Opera, etc.
      else{
          xmlString = (new XMLSerializer()).serializeToString(xmlData);
      }
      return xmlString;
  }
};
