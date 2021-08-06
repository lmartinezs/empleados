module.exports = app => {
    const skills = require("../controllers/skills.controller.js");

    app.get("/api/skills", skills.findAll);
    app.post("/api/skills", skills.create);


}