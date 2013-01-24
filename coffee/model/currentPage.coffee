class currentPage
  constructor: (page) ->
    nextURL = null
    lastURL = null
    selectMenu = null
    if typeof page isnt "undefined" and page isnt null
      currentPage = page
    else
      currentPage = 1
module.exports = currentPage  