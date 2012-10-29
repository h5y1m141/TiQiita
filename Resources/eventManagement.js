var eventManagement;

eventManagement = (function() {

  function eventManagement() {}

  eventManagement.prototype.loadOldEntry = function() {
    return Ti.App.addEventListener('loadOldEntry', function() {
      return Ti.API.info('test');
    });
  };

  return eventManagement;

})();

module.exports = eventManagement;
