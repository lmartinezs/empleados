const Empleado = require("../models/empleados.model.js");
const SkillEmployee = require("../models/skill_employee.model.js");

const Utils = require("../utils/utils.js");
const controller = require("./empleados.controller.js");

const config = require("../config/config.js");

var moment = require('moment');
const { check } = require('express-validator');


exports.create = (req, res) => {
  var errors = [];
  // Validate request
  if (!req.body) {
    errors.push("Importante enviar datos"); 
  }  
  if(!req.body.name)  {
    errors.push("Nombre es requerido");    
  }
  if(!req.body.email)  {
    errors.push("Email es requerido");    
  }
  if(!req.body.fechanacimiento)  {
    errors.push("Fecha de nacimiento es requerido");    
  }
  if(!req.body.direccion)  {
    errors.push("Direccion es requerido");    
  }
  if(!req.body.puesto)  {
    errors.push("Puesto es requerido");    
  }  
  
  if((!req.body.skills) || !Array.isArray(req.body.skills))  {
    errors.push('Los Skills son requeridos en formato:[{"id":"3"},{"id":"4"}] ');    
  }
  var regExpEmail = /([A-Z]|[a-z]|[^<>()\[\]\\\/.,;:\s@"]){4,}\@([A-Z]|[a-z]|[^<>()\[\]\\\/.,;:\s@"]){4,}\.(com|net)/;
  if((req.body.email) && (!regExpEmail.test(req.body.email)))  {
    errors.push("Formato de email invalido, solo se acepta .com, .org y .net");    
  }

  if(errors.length > 0){
    console.log("error");
    res.status(400).send({
      errors: errors
    });
  }else{   
      // Create
      const empleado = new Empleado({
        name: req.body.name,
        email: req.body.email,
        puesto: req.body.puesto,
        fechanacimiento: req.body.fechanacimiento,
        direccion: req.body.direccion
      });

      // Save
      Empleado.create(empleado, (err, data) => {
        if (err){
          res.status(500).send({
            status:
              "error",
            message:
              err.message || "Some error occurred while creating the Customer."
          });
        }else{ 
          
          //Create Skills Relation
          req.body.skills.forEach(skill => { 
            const skill_employee = new SkillEmployee({
              id_employee: data.id,
              id_skill: skill.id,
            });     
            
            SkillEmployee.create(skill_employee, (err, skills) => {
                console.log(skills);
            });        
          });
        
          //SkillEmployee.create
          res.send({
            status:
              "success",
            data:
              data
          });
        } 
      });
  }
};

exports.findAll = async(req, res) => {
    try{
        Empleado.getAll((err, data) => {
            if (err){
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving radiobases."
              });
            } else{ 
              /*var empleados = []; 
              data.forEach(empl => { 
                skills = SkillEmployee.findByEmployeeId(empl.id, (err, data) => {
                //  console.log(data);   
                });
                //skills = await exports.getSkillsbyEmployyeID(empl.id);
                console.log(skills)
                //console.log(empl.id);
                empleados.push(empl); 
              });*/
              res.send(data);
              //res.render('radiobases', {layout : 'index', radioBases: Empleados, listExists: true, config:config,fechas:dates,regions:regions,selectedRegion: selectedRegion});
            }
          });
    }
    catch( err ) {
        console.log("Error occured in one of the API call: ", err);
    };
  
};

exports.getSkillsbyEmployyeID  = (id) => {
  return new Promise ( (resolve, reject) => {

    SkillEmployee.findByEmployeeId(id, (err, data) => {
      if (err){
        reject(err);
      }else{
        resolve( data );   
      }      
    });
  });
};

exports.detail = (req, res) => {  
  res.render('detail', {layout : 'index', title:"Detail",empleadoId:req.params.empleadoId});
};

// Find a single Empleado with a radiobaseId
exports.findOne = async (req, res) => {  

    let skills = [];   
    try {
      skills = await exports.getSkillsbyEmployyeID(req.params.empleadoId);
      //console.log(skills);

    }
    catch( err ) {
        console.log("Error occured in one of the API call: ", err);
    };


    Empleado.findById (req.params.empleadoId, (err, data) => {      
      if (err) {
        if (err.kind === "not_found") {
          message = `Not found Empleado with id ${req.params.radiobaseId}.`;
          res.status(404).render('errorpage', {layout : 'index', message});
        } else {
          res.status(500).send({
            message: "Error retrieving Empleado with id " + req.params.radiobaseId
          });
        }
      } else {  
        //console.log(skills);
        var employee = []; 
        data.forEach(item => { 
          item.skills = skills;             
          employee.push(item); 
        });  
        res.send(employee);            
      }
      
    });

};

// Update a Empleado identified by the radiobaseId in the request
exports.update = (req, res) => {
   // Validate Request
   if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Empleado.updateById(
    req.params.radiobaseId,
    new Empleado(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Empleado with id ${req.params.radiobaseId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Empleado with id " + req.params.radiobaseId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Empleado with the specified radiobaseId in the request
exports.delete = (req, res) => {
    Empleado.remove(req.params.radiobaseId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Empleado with id ${req.params.radiobaseId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Empleado with id " + req.params.radiobaseId
            });
          }
        } else res.send({ message: `Empleado was deleted successfully!` });
      });
};

// Delete all Empleados from the database.
exports.deleteAll = (req, res) => {
    Empleado.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all radiobases."
          });
        else res.send({ message: `All Empleados were deleted successfully!` });
      });
};