

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


/* Denna metod är inspirerad av följande GitHub-projekt:
https://gist.github.com/scottlittle/c0c40e2b0aa4a364cc4216cc932e93e7 */
function make3DStapleDiagram(reports) {
  // Genomskinlighet på staplarna
  var alpha = 0.5;
  // x-axelns värden
  var mappedProblems = reports.map(function(value) {
    return value[0];
  });
  // y-axelns värden
  var mappedValues = reports.map(function(value) {
    return value[1];
  });

  // y-axeln skalas
  var yScale = d3.scale.linear()
    .domain([0, d3.max(mappedValues)])
    .range([0, 3]);

  // Referensen till AFrame-scenen.
  var scene = d3.select("a-scene");

  // Referensen till staplarna, med mappedValues (y-värdena)
  // som data.
  var bars = scene.selectAll("a-box.bar").data(mappedValues);

  // Den magiska enter-metoden, för att efterföljande
  // rader ska kunna göras.
  bars.enter().append("a-box").classed("bar", true);

  // Lägger till a-text element för respektive stapel,
  // som redogör för x-och y värdena när "crosshair"
  // är över den.
  $(".bar").append("<a-text> </a-text>");

  // Sätter attribut för staplarna;
  // - Position i form av x,y,z koordinater.
  // - Bredd för stapeln
  // - Höjd för stapeln
  // - Djup på stapeln
  // - Stapelns färg
  bars.attr({
      position: function(d, i) {
        var x = i * .75;
        var y = yScale(d) / 2;
        var z = 1;
        return x + " " + (y + 1.5) + " " + z;
      },
      width: function(d) {
        return 0.5;
      },
      depth: function(d) {
        return 0.5;
      },
      height: function(d) {
        return yScale(d);
      },
      opacity: alpha,
      color: 'cyan'
    })
    .on("mouseenter", function(data, index) {
      // En tyst retur om musen
      // redan befinner sig innanför stapeln.
      if (this.hovering) {
        return;
      }

      this.hovering = true;
      // Ändrar genomskinligheten på stapeln,
      // för att indikera att man tittar på den.
      d3.select(this).transition().duration(10)
        .attr({
          metalness: 0.8,
          opacity: .9
        });
      // Skapar en text i a-text elementet som redogör för både
      // x-och y värdena för den specifika staplen.
      d3.select(this).select("a-text")
        .attr({
          'color': 'hsla(240, 100%, 25%, 0.6)',
          'align': 'center',
          'position': '0 ' + (yScale(data) / 2 + .5) + ' 0',
          'scale': '1 1 1',
          'value': mappedProblems[index] + ', ' + data
        });
    })
    .on("mouseleave", function(data, index) {
      this.hovering = false;
      // Ändrar tillbaka till vanlig genomskinlighet,
      // när crosshair lämnar stapeln.
      d3.select(this).transition().duration(500)
        .attr({
          metalness: 0,
          opacity: alpha
        });
      // Tar bort texten när crosshair lämnar stapeln.
      d3.select(this).select("a-text")
        .attr({
          'color': 'cyan',
          'align': 'center',
          'position': '0 ' + (yScale(data) / 2 + .5) + ' 0',
          'scale': '.01 .01 .01',
          'value': data
        });
    })
}
