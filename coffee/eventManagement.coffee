class eventManagement
  constructor: () ->
  loadOldEntry: () ->
    return Ti.App.addEventListener 'loadOldEntry', () ->
      Ti.API.info 'test'

module.exports = eventManagement