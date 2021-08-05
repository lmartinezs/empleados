const Utils = require("./utils.js");
const Empleado = require("../models/empleados.model.js");

exports.convertByProperty = (originalObject, groupByProperty, secondProperty) => {
    var finalArray = [];  
    var uniqueVals = [];  
    originalObject.map((i) => {  
        var existingVals = uniqueVals.filter((j) => {  
            return (i[groupByProperty] == j)  
        });  
        if (existingVals.length == 0) {  
            uniqueVals.push(i[groupByProperty]);  
        }  
    });  
    uniqueVals.map((k) => {  
        var dataObj = [];  
        var expectedObj = {};  
        var items = originalObject.filter((l) => {  
            return (l[groupByProperty] == k)  
        });  
        items.map((m) => {  
            var obj = {};  
            obj[secondProperty] = m[secondProperty];              
            obj['fecha'] = m.fecha;  //m.data:
            obj['region'] = m.region;
            obj['trafico'] = m.trafico;
            obj['class'] = Utils.getTrafficClass(m.trafico);
            obj['date'] = Utils.getHumanDate(m.fecha);
            //setClass

            dataObj.push(obj);  
        });  
        expectedObj[groupByProperty] = k;  
        expectedObj['items'] = dataObj;  
        finalArray.push(expectedObj);  
    });  
    return finalArray;
};

exports.getTrafficClass = (trafico) => {
    var nameClass = 'gray';
    if(trafico < 15){
    nameClass = "red";
    }
    if(trafico > 15 && trafico <= 40){
    nameClass = "orange";
    }
    if(trafico > 40 && trafico <= 90){
    nameClass = "yellow";
    }
    if(trafico > 90){
    nameClass = "green";
    }
    return nameClass;
};
exports.getHumanDate = (fecha) => {
    var d = new Date(fecha);
    var day = '' + d.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ];
    return day +'-'+ monthNames[d.getMonth()];
}

exports.getArrayDates = (data) => {
    var items = [];
    data.forEach(fecha => {     
        var d = new Date(fecha.fecha);
        var day = '' + d.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                
        var humandate = {};
        humandate.humanDate = day +'-' +  monthNames[d.getMonth()]; 
        humandate.date= fecha.fecha; 
        items.push(humandate);
    });      
    return items;
    
}