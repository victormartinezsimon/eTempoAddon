function isEnd(type)
{
    return type == "Salida";
}

function isStart(type)
{
    return type ==  "Entrada";
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
var types = []

for( var ind = 0; ind < filter_rows.length; ind++) {

    times.push(filter_rows[ind].getElementsByTagName("td")[0].innerText)
    types.push(filter_rows[ind].getElementsByTagName("td")[1].innerText)
}

var msAcum = 0;
var msAcum_notworked = 0;

var lastTime = times[0];
var last_start = 0;

for( var index = 1; index < times.length; ++index)
{
    var now_type = types[index];
    var now_time = times[index];

    var startDate = new Date(lastTime.substr(6,4), lastTime.substr(3,2) - 1,lastTime.substr(0,2), lastTime.substr(11,2), lastTime.substr(14,2))//year, month, day, hours, minutes, seconds, milliseconds
    var endDate =  new Date(now_time.substr(6,4), now_time.substr(3,2) - 1,now_time.substr(0,2), now_time.substr(11,2), now_time.substr(14,2))//year, month, day, hours, minutes, seconds, milliseconds
    var diffDate = endDate - startDate;

    //I assume that if there is a endTime, we add the time to the worked time, this may work with a error sequence of Start, End1 , End2, setting the time to: (End1 - Start1) + (End2 - End1)
    //the same thing happens on a startTime, adding this time to the not worked time 
    if(isEnd(now_type))
    {
        msAcum += diffDate;
    }
    if(isStart(now_type))
    {
        msAcum_notworked += diffDate;
        last_start = index;
    }

    lastTime = now_time;
}

var calculate_time = false;
if(isStart(types[types.length - 1]))
{
    calculate_time = true;
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
        str = times[lastStart]
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

//allways we want to view the time not worked
var dateDescansado = new Date(msAcum_notworked)
addText("Tiempo descansado => " + (dateDescansado.getHours()-1) + " horas y " + formatMinutes(dateDescansado.getMinutes()) + " minutos.")
