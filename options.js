var DiasDeLaSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

function startFunction(){
   var table= document.getElementById("_tabla");

    for(i = 0; i < DiasDeLaSemana.length; i++)
    {
        var row = table.insertRow(i +1);
        {
            var cell = row.insertCell(0);
            cell.innerText = DiasDeLaSemana[i];
        }

        {
            var cell = row.insertCell(1);
            cell.innerHTML = "<input type='text' id='"+ DiasDeLaSemana[i] +"_h" +"'maxlength='2' size='1' minlength='2', value = '08'>"
        }

        {
            var cell = row.insertCell(2);
            cell.innerHTML = "<input type='text' id='"+ DiasDeLaSemana[i] +"_m" +"'maxlength='2' size='1' minlength='2' value = '20'>"
        }
    }

    let button = document.getElementById('myButton');
    button.addEventListener('click', function() {
        f_click(false);
    });

    default_values();
}

function f_click(_default){
    
    var resultados= {};
    for(i = 0; i < DiasDeLaSemana.length; i++)
    {
        {
            var key = DiasDeLaSemana[i] + "_h"
            var value =document.getElementById(key);
            resultados[key]= value.value;
        }   

        {
            var key = DiasDeLaSemana[i] + "_m"
            var value =document.getElementById(key);
            resultados[key]= value.value;
        }   
    }
    chrome.storage.local.set({key: resultados}, null);

    if(!_default) {
        alert("Datos guardados correctamente");
    }
}

function default_values() {
    chrome.storage.local.get(['key'], function(element){
        for(i = 0; i < DiasDeLaSemana.length; i++)
        {
            {
                var key = DiasDeLaSemana[i] + "_h"
                var v =document.getElementById(key);
                v.value = element.key[key];
            }

            {
                var key = DiasDeLaSemana[i] + "_m"
                var v =document.getElementById(key);
                v.value = element.key[key];
            }
        }
        f_click(true);
    });
}


startFunction();
