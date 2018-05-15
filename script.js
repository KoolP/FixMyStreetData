// 1. Ta reda på vilka, hur många raporter kategorier som finns tex traffic lights?
// key = service_name
// var reportsPerCategory = {}. Info i detta object kan hanteras(hämtas och tilldelas) via t.ex
// reportsPerCategory['Traffic lights'] eller reportsPerCategory[category], om category är en variabel som innehåller en sträng. Innan man har tilldelat ett värde via en nyckel så kommer det associerade värdet att vara undefined.
// 2. Skapa en tabell med ovanstående information via Document Object Model-gränssnittet. (Workshop 2)

addEventListener('load', function() {
  getJSON();
});

var url = "https://www.fixmystreet.com/open311/v2/requests.json?jurisdiction_id=fixmystreet.com&agency_responsible=2514&start_date=2018-04-01&end_date=2018-04-30";
var reportsPerCategory = {};

function getJSON() {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      //object with everything
      //console.log(result);
      var reports = result.requests[0].request[3].service_name;
      //console.log(result);
      console.log(reports);
      console.log(reports.length);
    });
}