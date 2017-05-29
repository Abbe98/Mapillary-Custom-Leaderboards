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
          callback.apply(null, [response]);
        }
      } else {
        return false;
      }
    }
    xhr.send();
  }
}