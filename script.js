// 1. Ta reda på vilka, hur många raporter kategorier som finns tex traffic lights?
// key = service_name
// var reportsPerCategory = {}. Info i detta object kan hanteras(hämtas och tilldelas) via t.ex
// reportsPerCategory['Traffic lights'] eller reportsPerCategory[category], om category är en variabel som innehåller en sträng. Innan man har tilldelat ett värde via en nyckel så kommer det associerade värdet att vara undefined.
// 2. Skapa en tabell med ovanstående information via Document Object Model-gränssnittet. (Workshop 2)

addEventListener('load', function() {
  getJSON();
});

var url = "https://www.fixmystreet.com/open311/v2/requests.json?jurisdiction_id=fixmystreet.com&agency_responsible=2514&start_date=2018-04-01&end_date=2018-04-30";
var sERVICENAME = "service_name";
var reportsPerCategory = {};

function getJSON() {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      //Tests
      //console.log(result);
      // var reports = result.requests[0].request[3].service_name;
      // console.log(reports);
      // console.log(reports.length);
      var reports = result.requests[0].request;
      var reportsPerCategory = objectBuilder(reports);

      createTable(reportsPerCategory);
    });
}

function objectBuilder(reports) {
  var reportsPerCategory = {};

  for(var i=0; i<reports.length; i++) {
    var report = reports[i];

    if (reportsPerCategory[report[sERVICENAME]] == undefined) {
      reportsPerCategory[report[sERVICENAME]] = "1";
    } else {
      var currentAmount = parseInt(reportsPerCategory[report[sERVICENAME]]);
      currentAmount = currentAmount + 1;
      reportsPerCategory[report[sERVICENAME]] = currentAmount.toString();
    }
  }
  console.log(reportsPerCategory);
  return Object.entries(reportsPerCategory);
}

function createTable(reportsPerCategory) {
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  var th1 = document.createElement('th');
  th1.appendChild(document.createTextNode('Service Category'));

  var th2 = document.createElement('th');
  th2.appendChild(document.createTextNode('Reports Amount'));

  tr.appendChild(th1);
  tr.appendChild(th2);
  table.appendChild(tr);

  var tr;
  var td1;
  var td2;
  var report;
  var text;

  for (var i = 0; i < reportsPerCategory.length; i++) {
    report = reportsPerCategory[i];

    tr = document.createElement('tr');
    changeRowColor(tr);

    td1 = document.createElement('td');
    text = report[0];
    td1.appendChild(document.createTextNode(text));

    td2 = document.createElement('td');
    text = report[1];
    td2.appendChild(document.createTextNode(text));

    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  }
  var parent2 = document.getElementById("div1");
  parent2.appendChild(table);
  // document.section.appendChild(table);
}

function changeRowColor(tr) {
  tr.addEventListener('mouseover', function(event) {
    event.target.parentElement.style.backgroundColor = '#88B337';
  });
  tr.addEventListener('mouseout', function(event) {
    event.target.parentElement.style.backgroundColor = 'white';
  });
}
