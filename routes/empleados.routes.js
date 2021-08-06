module.exports = app => {
    const empleados = require("../controllers/empleados.controller.js");
    const config = require("../config/config.js");    
    
    const { check } = require('express-validator');
    // Create a new Radiobase
    app.post("/empleados", empleados.create);     
    app.get("/api/empleados", empleados.findAll);
    app.get("/api/empleados/:empleadoId", empleados.findOne);

    app.get("/empleados", function(req, res, next) {
      res.render('home', {layout : 'index', title:"HOME"});
    });
    app.get("/", function(req, res, next) {      
      res.render('home', {layout : 'index', title:"HOME",config:config});
    });

    app.get("/create", function(req, res, next) {      
      res.render('create', {layout : 'index', title:"HOME"});
    });
    
    app.get("/empleados/:empleadoId", empleados.detail);     
  
    // Update a Radiobase with radiobaseId
    app.put("/empleados/:radiobaseId", empleados.update);
  };