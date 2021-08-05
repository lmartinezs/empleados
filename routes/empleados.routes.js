module.exports = app => {
    const empleados = require("../controllers/empleados.controller.js");
    
    const { check } = require('express-validator');
    // Create a new Radiobase
    app.post("/empleados", empleados.create);     
    app.get("/api/empleados", empleados.findAll);
    app.get("/api/empleados/:empleadoId", empleados.findOne);

    app.get("/empleados", function(req, res, next) {
      res.render('home', {layout : 'index', title:"HOME"});
    });
    app.get("/", function(req, res, next) {      
      res.render('home', {layout : 'index', title:"HOME"});
    });

    app.get("/create", function(req, res, next) {      
      res.render('create', {layout : 'index', title:"HOME"});
    });
    
    app.get("/empleados/:empleadoId", empleados.detail);     
    

    //app.get("/empleados/regions", empleados.getRegions);
  
    // Retrieve a single Radiobase with radiobaseId
    

    app.get("/region/:regionId", empleados.setRegion);
  
    // Update a Radiobase with radiobaseId
    app.put("/empleados/:radiobaseId", empleados.update);
  
    // Delete a Radiobase with radiobaseId
    //app.delete("/radiobases/:radiobaseId", radiobases.delete);
  
    // Create all Radiobase
    //app.delete("/radiobases", radiobases.deleteAll);
  };