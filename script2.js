//How to load these functions only once within the pages..

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
      reportsPerCategory = objectBuilder(reports);

      // createTable(reportsPerCategory);
      // buildDiagram(reportsPerCategory);
      make3DStapleDiagram(reportsPerCategory);
    });
}

function objectBuilder(reports) {
  var reportsPerCategory = {};

  for (var i = 0; i < reports.length; i++) {
    var report = reports[i];

    if (reportsPerCategory[report[sERVICENAME]] == undefined) {
      reportsPerCategory[report[sERVICENAME]] = 1; // "1"
    } else {
      var currentAmount = reportsPerCategory[report[sERVICENAME]];
      currentAmount = currentAmount + 1;
      reportsPerCategory[report[sERVICENAME]] = currentAmount
    }
  }
  console.log(reportsPerCategory, Object.entries(reportsPerCategory));
  return Object.entries(reportsPerCategory);
}


/*examples https://gist.github.com/scottlittle/c0c40e2b0aa4a364cc4216cc932e93e7 */
function make3DStapleDiagram(reports) {

  var alpha = 0.9;
  var mapKeyArr = reports.map(function(value) {
    return value[0];
  });
  var mapValueArr = reports.map(function(value) {
    return value[1];
  });
  console.log(mapValueArr.sort(function(b, a){return a-b}));
  var yScale = d3.scale.linear()
    .domain([0, d3.max(mapValueArr)])
    .range([0, 3]);
  var scene = d3.select("a-scene");
  var bars = scene.selectAll("a-box.bar").data(mapValueArr);

  // Loop and create bars
  bars.enter().append("a-box").classed("bar", true);

  $(".bar").append("<a-text> </a-text>");

  bars.attr({
      position: function(d, i) {
        var x = i * .40;
        var y = yScale(d) / 2;
        var z = 1;
        return (x + 5) + " " + (y + 0.5) + " " + (z + 3.8);
      },
      width: function(d) {
        return 0.2;
      },
      depth: function(d) {
        return 0.2;
      },
      height: function(d) {
        return yScale(d);
      },
      opacity: alpha,
      color: 'orange'
    })
    .on("mouseenter", function(data, index) {
      //check
      if (this.hovering) {
        return;
      }
      this.hovering = true;
      d3.select(this).transition().duration(10)
        .attr({
          metalness: 0.8,
          opacity: .9
        });

      d3.select(this).select("a-text")
        .attr({
          'color': 'hsla(39, 100%, 50%, 1)',
          'align': 'center',
          'position': '0 ' + (yScale(data) / 2 + .5) + ' 0',
          'scale': '1 1 1',
          'value': mapKeyArr[index] + ', ' + data
        });
    })
    .on("mouseleave", function(data, index) {
      this.hovering = false;
      d3.select(this).transition().duration(300)
        .attr({
          metalness: 0,
          opacity: alpha
        });
      // Tar bort texten när crosshair lämnar stapeln.
      d3.select(this).select("a-text")
        .attr({
          'color': 'orange',
          'align': 'center',
          'position': '0 ' + (yScale(data) / 2 + .5) + ' 0',
          'scale': '.01 .01 .01',
          'value': data
        });
    })
}
