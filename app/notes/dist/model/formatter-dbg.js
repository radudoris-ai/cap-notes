sap.ui.define([], function () {
  "use strict";

  const formatter = {
    statusClass(status) {
      console.log("STATUS:", status);
      switch (status) {
        case "N":
          return "statusN";
        case "I":
          return "statusI";
        case "D":
          return "statusD";
        default:
          return "";
      }
    }
  };

  /*
  export default {
  
      statusClass: function(status) {
          
          switch (status) {
              case "N":
                  return "statusN"; // New
              case "I":
                  return "statusI"; // In Process
              case "D":
                  return "statusD"; // Done
              default:
                  return "";
          }
      }
  
  } */
  return formatter;
});
//# sourceMappingURL=formatter-dbg.js.map
