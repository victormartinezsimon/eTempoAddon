var Days_of_the_week = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

chrome.runtime.onInstalled.addListener(function() {
    console.log("estamos guardando");
    var results= {};
    for(i = 0; i < Days_of_the_week.length; i++)
    {
        {
            var key = Days_of_the_week[i] + "_h"
            var value ="08"
            results[key]= value;
        }   

        {
            var key = Days_of_the_week[i] + "_m"
            var value ="00"
            results[key]= value;
        }   
    }
    chrome.storage.local.set({key: results}, null);
  });
