# FixMyStreetData
Fetch and visualise data from FixMyStreet.org


Frågor

1.Hur bygger denna funktion key value pairs? behövs parseInt?
function objectBuilder(reports) {
  var reportsPerCategory = {};

  for(var = i=0; i<reports.length; i++) {
    var report = reports[i];

    if (reportsPerCategory[report[sERVICENAME]] = undefined) {
      reportsPerCategory[report[sERVICENAME]] = "1";
    } else {
      var currentAmount = parseInt(reportsPerCategory[report[sERVICENAME]]);
      currentAmount = currentAmount + 1;
      reportsPerCategory[report[sERVICENAME]] = currentAmount.toString();
    }  
  }
  return Object.entries(reportsPerCategory);
}
