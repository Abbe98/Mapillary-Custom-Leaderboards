function dataChanged() {
  var target = document.getElementById('goToBoard');
  if (users.length < 2) {
    target.setAttribute('disabled', 'true');
    target.href = '#';
    target.setAttribute('data-tooltip', 'Two participants are required');
    return;
  } else {
    target.setAttribute('disabled', 'false');
    target.removeAttribute('data-tooltip');
    target.href = createBoardUrl();
  }

  if (time) {
    if (!startDate || !endDate) {
      target.setAttribute('disabled', 'true');
      target.href = '#';
      target.setAttribute('data-tooltip', 'Add some dates to the time frame');
    } else {
      if (new Date(startDate) >= new Date(endDate)) {
        target.setAttribute('disabled', 'true');
        target.href = '#';
        target.setAttribute('data-tooltip', 'The end and start dates does not work together');
      } else {
        target.setAttribute('disabled', 'false');
        target.removeAttribute('data-tooltip');
        target.href = createBoardUrl();
      }
    }
  }
}

function createBoardUrl() {
  var url = 'board.html?users=' + users.join();
  if (time) {
    url += '&start=' + startDate + '&end=' + endDate;
  }

  return url;
}

document.getElementById('userSearch').addEventListener('input', function (e) {
  mapillary.searchUser(e.target.value, (result) => {
    var resultContainer = document.getElementById('usersResult');

    // remove existing items
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
    }

    result.matches.forEach((user) => {
      if (!users.contains(user.username)) {
        var element = document.createElement('li');
        var username = document.createTextNode(user.username);
        element.appendChild(username);
        element.setAttribute('data-user', user.username);

        resultContainer.appendChild(element);
      }
    });
  });
}, false);

document.getElementById('userSearch').addEventListener('focusout', function (e) {
  // without delay items in drop-down is removed before click event executes
  setTimeout(() => {
    document.getElementById('userSearch').value = '';
    var resultContainer = document.getElementById('usersResult');
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
    }
  }, 200);
});

var users = [];

// adding users
document.getElementById('userInput').addEventListener('click', function (e) {
  if (e.target.hasAttribute('data-user')) {
    users.push(e.target.getAttribute('data-user'));

    var element = document.createElement('span');
    var username = document.createTextNode(e.target.getAttribute('data-user'));
    var child = document.createElement('span');
    var childX = document.createTextNode('X');

    child.appendChild(childX);
    element.appendChild(username);
    element.appendChild(child);
    element.setAttribute('data-user', e.target.getAttribute('data-user'));

    document.getElementById('userLabels').appendChild(element);
    dataChanged();
  }
});

// removing users
document.getElementById('userLabels').addEventListener('click', function (e) {
  if (e.target.outerText === 'X') {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    users.remove(e.target.parentNode.getAttribute('data-user'));
    dataChanged();
  }
});


// time things
var time = false;
var startDate;
var endDate;

document.getElementById('enableTime').addEventListener('click', function (e) {
  if (!time) {
    document.getElementById('time').style.display = 'block';
    this.innerText = 'Remove time frame';
    time = true;
  } else {
    document.getElementById('time').style.display = 'none';
    this.innerText = 'Add time frame';
    time = false;
  }
  dataChanged();
});

var startDateInput = new Flatpickr(document.getElementById('startDate'), {
  altInput: true,
  onChange: function(selectedDates, dateStr, instance) {
    handleDateInputs(selectedDates[0].toISOString(), instance.element.id);
  }
});

var endDateInput = new Flatpickr(document.getElementById('endDate'), {
  altInput: true,
  onChange: function(selectedDates, dateStr, instance) {
    handleDateInputs(selectedDates[0].toISOString(), instance.element.id);
  }
});

function handleDateInputs(dateStr, type) {
  if (type === 'startDate') {
    startDate = dateStr;
  } else {
    endDate = dateStr;
  }

  dataChanged();
}
