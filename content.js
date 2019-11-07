function nextStart(indexStart) {
    for( var i =indexStart; i < type.length; i++) {
        if(type[i] == "Entrada"){
           return i;
        }
    }
    return -1;
}

function nextEnd(indexStart) {
    for( var i =indexStart; i < type.length; i++) {
        if(type[i] == "Salida"){
           return i;
        }
    }
    return -1;
}

var rows = document.getElementsByClassName("PowerGridValidar")[0].rows;//get the rows

var filter_rows = []

for(var ind = rows .length -2; ind >= 1; ind= ind -2) {
    i = rows [ind];
    filter_rows.push(rows [ind]);//filter the rows
}

var times = []
var type = []

for( var ind = 0; ind < filter_rows.length; ind++) {

    times.push(filter_rows[ind].getElementsByTagName("td")[0].innerText)
    type.push(filter_rows[ind].getElementsByTagName("td")[1].innerText)
}


//var start = new Date(tiempos[0])
var actualIndex = 0;
var msAcum = 0;
var investigar = true;
var calcularTiempo = false;

while(investigar) {

    var startIdx = nextStart(actualIndex);

    if(startIdx != -1)
    {
        //start time
        var endIdx = nextEnd(actualIndex);
        if(endIdx != -1)
        {
            //there is some close data
            var startDate = new Date(times[startIdx])
            var endDate = new Date(times[endIdx])
            var diff = endDate - startDate;
            msAcum += diff;
            actualIndex = endIdx + 1;//we go to the next index
        }
        else
        {
            //there is a open, but not end
            investigar = false;
            calcularTiempo = true;
        }
    }
    else
    {
        //here there are no opening. We go out without do anything
        calcularTiempo = false;
        investigar = false;
    }
}

if(calcularTiempo ) {

    var totalTime = 8 * 60 * 60 * 1000 + 20 *60 * 1000;//8 h y 20 min
    if(new Date().getDay() == 5)
    {
        totalTime = 7 * 60 * 60 * 1000 + 15 * 60 * 1000;//7 h y 15 min
    }
    var leftTime = (totalTime - msAcum);
    var startDate = new Date(times[nextStart(actualIndex)])
    var exitTime = new Date(startDate.getTime() + leftTime)

    document.getElementById("FooterCenter").innerText += "Salida a las => " + exitTime
}
else
{
    var totalTime = new Date(msAcum)
    document.getElementById("FooterCenter").innerText += "Horas =>" + (totalTime.getHours() - 1) + " Minutos => " + totalTime.getMinutes()
}