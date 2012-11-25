var state;

state = (function() {

  function state() {
    this.state = new defaultState();
  }

  return state;

})();

module.exports = state;
