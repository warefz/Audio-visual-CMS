(function (root, factory) {
  if (typeof define === 'function') {
      // AMD. Register as an anonymous module.
      define(factory);
  } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like enviroments that support module.exports,
      // like Node.
      module.exports = factory();
  } else {
      // Browser globals (root is window)
      root.TYPE = factory();
  }
}(this, function () {

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  var type = {
    MSG_TYPE:{
      TRAINEE:'TRAINEE',
      WITHDRAW:'WITHDRAW'
    }
  };

  return type
}));