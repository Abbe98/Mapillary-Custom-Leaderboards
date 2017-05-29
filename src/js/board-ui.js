window.onload = function() {
  var users = getUrlParameter('users');
  if (users) {
    users = users.split(',');
  } else {
    // #TODO warning
  }

  var start = getUrlParameter('start');
  var end = getUrlParameter('end');

  var colors = ['#0F9D58', '#F4B400', '#4285F4', '#DB4437'];
  var usersData = [];
  var totalPhotos = 0;

  mapillary.getBoardData(users, (result) => {
    result.forEach((user, i) => {
      // use i to map users against the colors
      if (i > 3) {
        i = 0;
      }

      usersData.push([user.username, user.image_count, colors[i]]);
      totalPhotos += user.image_count;
    });

    // make sure the first and last items never has the same color(for the pie chart)
    if (usersData.last()[2] === usersData[0][2]) {
      usersData.last()[2] = colors[1];
    }

    renderTable(usersData);
    renderChart(usersData, totalPhotos);
  }, start, end);
};

function renderTable(usersData) {
  var fragment = document.createDocumentFragment();
  var header = document.createElement('tr');


  var titleRank = document.createElement('td');
  titleRank.appendChild(document.createTextNode('Rank'));
  var titleUser = document.createElement('td');
  titleUser.appendChild(document.createTextNode('User'));
  var titlePhotos = document.createElement('td');
  titlePhotos.appendChild(document.createTextNode('Photos'));

  header.appendChild(titleRank);
  header.appendChild(titleUser);
  header.appendChild(titlePhotos);

  fragment.appendChild(header);

  usersData.forEach((userData, i) => {
    var tr = document.createElement('tr');
    tr.style.background = userData[2];

    var tdRank = document.createElement('td');
    var rank = document.createTextNode(i + 1);
    tdRank.appendChild(rank);

    var tdUser = document.createElement('td');
    var user = document.createTextNode(userData[0]);
    tdUser.appendChild(user);

    var tdPhotos = document.createElement('td');
    var photos = document.createTextNode(userData[1]);
    tdPhotos.appendChild(photos);

    tr.appendChild(tdRank);
    tr.appendChild(tdUser);
    tr.appendChild(tdPhotos);

    fragment.appendChild(tr);
  });

  document.getElementById('table').appendChild(fragment);
}

function renderChart(usersData, totalPhotos) {

  function drawPieSlice(endAngle, color) {
    var center = [canvas.width / 2, canvas.height / 2];

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(center[0], center[1]);
    ctx.arc(center[0], center[1], Math.min(...center), startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }

  var canvasSize = (window.innerWidth <= 750 ? window.innerWidth / 2 : 750 / 2);
  var canvas = document.getElementById('chart');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  var ctx = canvas.getContext('2d');

  var startAngle = 0;
  usersData.forEach((user, i) => {
    var precentage = user[1] / totalPhotos;
    var itemAngle = Math.radians((360 * (precentage)));
    drawPieSlice(startAngle + itemAngle, user[2]);
    startAngle += itemAngle;
  });
}