function nextStart(indexStart) {
    for( var i =indexStart; i < tipo.length; i++) {
        if(tipo[i] == "Entrada"){
           return i;
        }
    }
    return -1;
}

function nextEnd(indexStart) {
    for( var i =indexStart; i < tipo.length; i++) {
        if(tipo[i] == "Salida"){
           return i;
        }
    }
    return -1;
}

function addText(str1){
    dondeIntroducir = document.getElementById("MainContent_gridMovimientos")
    var my_p = document.createElement("p")
    my_p.innerText = str1
    dondeIntroducir.appendChild(my_p)
}

var rows = document.getElementsByClassName("PowerGridValidar")[0].rows;

var filter_rows = []

for(var ind = rows .length -2; ind >= 1; ind= ind -2) {
    i = rows [ind];
    filter_rows.push(rows [ind]);
}

var tiempos = []
var tipo = []

for( var ind = 0; ind < filter_rows.length; ind++) {

    tiempos.push(filter_rows[ind].getElementsByTagName("td")[0].innerText)
    tipo.push(filter_rows[ind].getElementsByTagName("td")[1].innerText)
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
        //hay una apertura de tiempo
        var endIdx = nextEnd(actualIndex);
        if(endIdx != -1)
        {
            //se ha cerrado
            str = tiempos[startIdx]
            var startDate = new Date(str.substr(6,4), str.substr(3,2) - 1,str.substr(0,2), str.substr(11,2), str.substr(14,2))//year, month, day, hours, minutes, seconds, milliseconds
            str = tiempos[endIdx]
            var endDate = new Date(str.substr(6,4), str.substr(3,2) - 1,str.substr(0,2), str.substr(11,2), str.substr(14,2))
            var diff = endDate - startDate;
            msAcum += diff;
            actualIndex = endIdx + 1;//nos ponemos donde la ultima salida
        }
        else
        {
            //hay una apertura, sin cierre
            investigar = false;
            calcularTiempo = true;
        }
    }
    else
    {
        //si llegamos aqui es porque ya no hay aperturas, asi que salimos e indicamos que no se investigue mas

        calcularTiempo = false;
        investigar = false;
    }
}

if(calcularTiempo ) {

    var DiasDeLaSemana = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

    chrome.storage.local.get(['key'], function(element){
        var day = new Date().getDay()
        var keyH = DiasDeLaSemana[day]+ "_h"
        var keyM = DiasDeLaSemana[day]+ "_m"

        var finded = false;

        if(!keyH) {
            var totalTime = 8 * 60 * 60 * 1000 + 20 *60 * 1000;
        }
        else {
            var totalTime = element.key[keyH] * 60 * 60 * 1000 + element.key[keyM] *60 * 1000;
            finded = true;
        }


        var now = new Date();
        str = tiempos[startIdx]
        var lastEnter = new Date(str.substr(6,4), str.substr(3,2) - 1,str.substr(0,2), str.substr(11,2), str.substr(14,2))
        var timeWorkedSinceLastEnter = now - lastEnter
        msAcum += timeWorkedSinceLastEnter
        var leftTime = totalTime - msAcum // this is the totalTime we must work from the last enter
        var dateExit = new Date(now.getTime() + leftTime);
        var dateWorked = new Date(msAcum)
        var dateTotalTime = new Date(totalTime)

        addText("Tiempo Trabajado => " + (dateWorked.getHours()-1) + " horas y " + dateWorked.getMinutes() + " minutos." + " (" + (dateTotalTime.getHours()-1)+":"+dateTotalTime.getMinutes() + ")")
        addText("Hora salida => " + dateExit.getHours() + ":" + dateExit.getMinutes())
        if(!finded) {
            addText("Usando tiempo por defecto. Por favor, configure la extensión")
        }
    });
    
}
else
{
    var dateWorked = new Date(msAcum)
    addText("Tiempo Trabajado => " + (dateWorked.getHours()-1) + " horas y " + dateWorked.getMinutes() + " bminutos.")
}