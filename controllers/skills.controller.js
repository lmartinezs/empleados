const Skill = require("../models/skills.model.js");
const Utils = require("../utils/utils.js");
const controller = require("./skills.controller.js");

const config = require("../config/config.js");

var moment = require('moment');
const { check } = require('express-validator');


exports.create = (req, res) => {
  console.log(req.body);
  var errors = [];
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  if ((moment(req.body.fechanacimiento, 'YYYY-MM-DD').isValid()) == "false") {
    errors.push("Fecha no válida, asegurese de agregarla en el YYYY-MM-DD");
  }
  if (!req.body.hasOwnProperty("name")) {
    errors.push("name es requerido");
  }
  if (!req.body.hasOwnProperty("email")) {
    errors.push("email es requerido");
  }

  //res.send(errors);


  // Create
  const skill = new Skill({
    name: req.body.name,
  });

  // Save
  Skill.create(skill, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.setRegion = async (req, res) => {

  regionStatic.setRegion(req.params.regionId)
  res.send(regionStatic.getRegion());
};

exports.findAll = async (req, res) => {

  Skill.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving radiobases."
      });
    } else {

      res.send(data);
      //res.render('radiobases', {layout : 'index', radioBases: Empleados, listExists: true, config:config,fechas:dates,regions:regions,selectedRegion: selectedRegion});
    }
  });

};


// Find a single Skill with a radiobaseId
exports.findOne = async (req, res) => {
  let dates = [];
  let regions = [];
  try {
    dates = await exports.getArrayDates();
    regions = await exports.getRegions();
  }
  catch (err) {
    console.log("Error occured in one of the API call: ", err);
  };
  Skill.findById(req.params.radiobaseId, regionStatic.getRegion(), (err, data) => {

    if (err) {
      if (err.kind === "not_found") {
        message = `Not found Skill with id ${req.params.radiobaseId}.`;
        res.status(404).render('errorpage', { layout: 'index', message });
      } else {
        res.status(500).send({
          message: "Error retrieving Skill with id " + req.params.radiobaseId
        });
      }
    } else {

      var items = [];
      /*
                  for (var i = 0; i < dates.length; i++) {   
      
                      var item = [];
                      data.forEach(radiobase => {  
                        //console.log("fecha: " +dates[i].date);
                        //console.log("fechadelropw: " +radiobase.fecha );
                        if(radiobase.fecha.getTime() === dates[i].date.getTime() ){  
                          radiobase.class = Utils.getTrafficClass(radiobase.trafico);              
                          radiobase.date = Utils.getHumanDate(radiobase.fecha);
                          items.push(radiobase);                                        
                        }
                      });               
                  }*/
      console.log(regions);

      data.forEach(radiobase => {

        radiobase.class = Utils.getTrafficClass(radiobase.trafico);

        radiobase.date = Utils.getHumanDate(radiobase.fecha);
        //console.log(radiobase.fecha);
        //console.log(dates);
        //let obj = dates.find(o => o.date === radiobase.fecha);
        //if (Object.values(dates).indexOf(radiobase.fecha) > -1) {
        //  console.log('has ' + radiobase.fecha);
        //}
        //console.log(obj);              
        items.push(radiobase);
        //radiobase.date = day +'-'+ monthNames[d.getMonth()];

      });
      //console.log(items);            
      res.render('radiobasedetail', { layout: 'index', radiobaseId: req.params.radiobaseId, radioBases: items, listExists: true, config: config, fechas: dates, regions: regions });
    }



  });
};

// Update a Skill identified by the radiobaseId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Skill.updateById(
    req.params.radiobaseId,
    new Skill(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Skill with id ${req.params.radiobaseId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Skill with id " + req.params.radiobaseId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Skill with the specified radiobaseId in the request
exports.delete = (req, res) => {
  Skill.remove(req.params.radiobaseId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Skill with id ${req.params.radiobaseId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Skill with id " + req.params.radiobaseId
        });
      }
    } else res.send({ message: `Skill was deleted successfully!` });
  });
};
