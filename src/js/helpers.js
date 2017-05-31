function getUrlParameter(parameter) {
  var url = window.location.search.substring(1);
  var vars = url.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0].toLowerCase() == parameter.toLowerCase()) {
      return pair[1];
    }
  }
  return false;
}

function createTinyUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    // use YQL to get around TinyUrl CORS limitations
    xhr.open('GET', 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + encodeURIComponent('https://tinyurl.com/api-create.php?url=' + url) + '%22&format=json', true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (typeof callback == 'function') {
          var response = JSON.parse(xhr.responseText)
          callback.apply(null, [response.query.results.body]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
}

Array.prototype.remove = function(item) {
  var index = this.indexOf(item);

  if (index > -1) {
    this.splice(index, 1);
  } else {
    return -1;
  }
}

Array.prototype.contains = function(item) {
  var index = this.indexOf(item);

  if (index > -1) {
    return true;
  } else {
    return false;
  }
}

Array.prototype.random = function() {
  return this[Math.floor((Math.random() * this.length))];
}

Array.prototype.last = function() {
  return this[this.length - 1];
}

Math.radians = function(degrees) {
  return degrees * (Math.PI / 180);
}

var mapillary = {
  clientId: 'WHZlUV9FNXhFZ24xZEZQRHZzUlZ3QTozMjUzMmE0NGFlMmZhYzFl',
  endpoint2: 'https://a.mapillary.com/v2/',
  endpoint3: 'https://a.mapillary.com/v3/',

  searchUser: function(string, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', mapillary.endpoint2 + 'search/u?client_id=' + mapillary.clientId + '&match=' + string, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  },

  getBoardData: function(users, callback, startDate, endDate) {
    var xhr = new XMLHttpRequest();
    var url = mapillary.endpoint3 + 'leaderboard/images?client_id=' + mapillary.clientId + '&usernames=' + users.join();

    if (startDate && endDate) {
      url += '&start_time=' + startDate + '&end_time=' + endDate;
    }
    xhr.open('GET', url, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          if (response.length) {
            callback.apply(null, [response]);
          } else {
            callback.apply(null, ['No data for this board yet.']);
          }
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }
}