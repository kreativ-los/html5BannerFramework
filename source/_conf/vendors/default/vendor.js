var getUriParams = function() {
  var queryString = {};
  var query = window.location.search.substring(1);
  var parmsArray = query.split('&');
  if (parmsArray.length <= 0) return queryString;
  for (var i = 0; i < parmsArray.length; i++) {
    var pair = parmsArray[i].split('=');
    var val = decodeURIComponent(pair[1]);
    if (val != '' && pair[0] != '') queryString[pair[0]] = val;
  }
  return queryString;
}();

document.getElementById('clicktag').setAttribute('href', getUriParams.clicktag);
