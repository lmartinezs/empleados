const sql = require("./db.js");

// constructor
const Skill = function (skill) {
  this.id = skill.id;
  this.name = skill.name;
};

Skill.create = (newSkill, result) => {
  sql.query("INSERT INTO skills SET ?", newSkill, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created skill: ", { id: res.insertId, ...newSkill });
    result(null, { id: res.insertId, ...newSkill });
  });
};


Skill.findById = (skillId, result) => {
  sql.query(`SELECT * FROM employee WHERE skills = '${skillId}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found skill: ", res);
      result(null, res);
      return;
    }

    // not found Skill with the id
    result({ kind: "not_found" }, null);
  });
};

Skill.getAll = result => {
  sql.query(`select * from skills order by id asc limit 10000`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("skills: ", res);
    result(null, res);
  });
};

Skill.updateById = (id, skill, result) => {
  sql.query(
    "UPDATE skills SET email = ?, name = ?, active = ? WHERE id = ?",
    [skill.email, skill.name, skill.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Skill with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated skill: ", { id: id, ...skill });
      result(null, { id: id, ...skill });
    }
  );
};

Skill.remove = (id, result) => {
  sql.query("DELETE FROM skills WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Skill with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted skill with id: ", id);
    result(null, res);
  });
};

module.exports = Skill;