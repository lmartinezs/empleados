const sql = require("./db.js");

// constructor
const SkillEmployee = function (skill) {
  this.id_employee = skill.id_employee;
  this.id_skill = skill.id_skill;
};

SkillEmployee.create = (newSkill, result) => {
  sql.query("INSERT INTO skills_employee SET ?", newSkill, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created skill: ", { id: res.insertId, ...newSkill });
    result(null, { id: res.insertId, ...newSkill });
  });
};


SkillEmployee.findByEmployeeId = (id_employee, result) => {
  sql.query(`SELECT skills_employee.*, skills.name FROM skills_employee left join skills on skills.id = skills_employee.id_skill WHERE id_employee =  '${id_employee}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found skill: ", res);
      result(null, res);
    }
  });
};

SkillEmployee.getAll = result => {
  sql.query(`select * from skills_employee order by id asc limit 10000`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("skills: ", res);
    result(null, res);
  });
};


module.exports = SkillEmployee;