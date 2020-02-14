//get the next enter
function nextStart(indexStart) {
    for( var i =indexStart; i < type.length; i++) {
        if(type[i] == "Entrada"){
           return i;
        }
    }
    return -1;
}
//get the next exit
function nextEnd(indexStart) {
    for( var i =indexStart; i < type.length; i++) {
        if(type[i] == "Salida"){
           return i;
        }
    }
    return -1;
}

//add some text in the page
function addText(str1){
    where_to_add = document.getElementById("MainContent_gridMovimientos")
    var my_p = document.createElement("p")
    my_p.innerText = str1
    where_to_add.appendChild(my_p)
}

function formatMinutes(value){
    str = value;
    if(value < 10) {
        str = "0" + str
    }
    return str;
}

var rows = document.getElementsByClassName("PowerGridValidar")[0].rows;
var filter_rows = []

for(var ind = rows .length -2; ind >= 1; ind= ind -2) {
    i = rows [ind];
    filter_rows.push(rows [ind]);
}

var times = []
var type = []

for( var ind = 0; ind < filter_rows.length; ind++) {

    times.push(filter_rows[ind].getElementsByTagName("td")[0].innerText)
    type.push(filter_rows[ind].getElementsByTagName("td")[1].innerText)
}


var actualIndex = 0;
var msAcum = 0;
var continue_investigating = true;
var calculate_time = false;

while(continue_investigating) {

    var startIdx = nextStart(actualIndex);

    if(startIdx != -1)
    {
        //here there is a start time
        var endIdx = nextEnd(actualIndex);
        if(endIdx != -1)
        {
            //the time is closed, so we accumulate the time
            str = times[startIdx]
            var startDate = new Date(str.substr(6,4), str.substr(3,2) - 1,str.substr(0,2), str.substr(11,2), str.substr(14,2))//year, month, day, hours, minutes, seconds, milliseconds
            str = times[endIdx]
            var endDate = new Date(str.substr(6,4), str.substr(3,2) - 1,str.substr(0,2), str.substr(11,2), str.substr(14,2))
            var diff = endDate - startDate;
            msAcum += diff;
            actualIndex = endIdx + 1;//we move the index to the next value
        }
        else
        {
            //here there is a start without a end, so we stop
            continue_investigating = false;
            calculate_time = true;
        }
    }
    else
    {
        //here there are no more starts, so we exit
        calculate_time = false;
        continue_investigating = false;
    }
}
//if we must calculate time, this is because there is a start without a exit
if(calculate_time) {

    var Days_of_the_week = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

    chrome.storage.local.get(['key'], function(element){
        var day = new Date().getDay()
        var keyH = Days_of_the_week[day]+ "_h"
        var keyM = Days_of_the_week[day]+ "_m"

        var finded = false;

        if((Object.keys(element).length === 0 && element.constructor === Object) || !element.key[keyH] || !element.key[keyM]) {
            var totalTime = 8 * 60 * 60 * 1000 + 20 *60 * 1000;
        }
        else {
            var totalTime = element.key[keyH] * 60 * 60 * 1000 + element.key[keyM] *60 * 1000;
            finded = true;
        }


        var now = new Date();
        str = times[startIdx]
        var lastEnter = new Date(str.substr(6,4), str.substr(3,2) - 1,str.substr(0,2), str.substr(11,2), str.substr(14,2))
        var timeWorkedSinceLastEnter = now - lastEnter
        msAcum += timeWorkedSinceLastEnter
        var leftTime = totalTime - msAcum // this is the totalTime we must work from the last enter
        var dateExit = new Date(now.getTime() + leftTime);
        var dateWorked = new Date(msAcum)
        var dateTotalTime = new Date(totalTime)

        addText("Tiempo Trabajado => " + (dateWorked.getHours()-1) + " horas y " + formatMinutes(dateWorked.getMinutes()) + " minutos." + 
                " (" + (dateTotalTime.getHours()-1) + ":" + formatMinutes(dateTotalTime.getMinutes()) + ")")
        addText("Hora salida => " + dateExit.getHours() + ":" + formatMinutes(dateExit.getMinutes()))
        if(!finded) {
            addText("Usando tiempo por defecto. Por favor, configure la extensión")
        }
    });
    
}
else
{
    var dateWorked = new Date(msAcum)
    addText("Tiempo Trabajado => " + (dateWorked.getHours()-1) + " horas y " + formatMinutes(dateWorked.getMinutes()) + " minutos.")
}