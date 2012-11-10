var eventManagement;

eventManagement = (function() {

  function eventManagement() {}

  eventManagement.prototype.loadOldEntry = function() {
    return Ti.App.addEventListener('loadOldEntry', function() {
      return Ti.API.info('test');
    });
  };

  eventManagement.prototype.stockItemToQiita = function(uuid) {
    Ti.API.info(uuid);
    return true;
  };

  return eventManagement;

})();

module.exports = eventManagement;
