const sql = require("./db.js");

// constructor
const Empleado = function (empleado) {
  this.name = empleado.name;
  this.email = empleado.email;
  this.direccion = empleado.direccion;
  this.puesto = empleado.puesto;
  this.fechanacimiento = empleado.fechanacimiento;
};

Empleado.create = (newEmpleado, result) => {
  sql.query("INSERT INTO employee SET ?", newEmpleado, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created empleado: ", { id: res.insertId, ...newEmpleado });
    result(null, { id: res.insertId, ...newEmpleado });
  });
};

Empleado.getRegions = result => {
  sql.query(`select distinct(region) from employee order by region ASC;`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("regions: ", res);
    result(null, res);
  });
};
Empleado.getDates = result => {
  sql.query(`select distinct(fecha) from employee order by fecha asc;`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("fechas: ", res);
    result(null, res);
  });
};

Empleado.findById = (empleadoId, result) => {
  sql.query(`SELECT * FROM employee WHERE id = '${empleadoId}' `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found empleado: ", res);
      result(null, res);
      return;
    }

    // not found Empleado with the id
    result({ kind: "not_found" }, null);
  });
};

Empleado.getAll = result => {
  sql.query(`select * from employee order by id asc limit 10000`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("empleados: ", res);
    result(null, res);
  });
};

Empleado.getCompleteAll = result => {
  sql.query(`select * from employee order by empleado,fecha asc limit 10000`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("empleados: ", res);
    result(null, res);
  });
};

Empleado.updateById = (id, empleado, result) => {
  sql.query(
    "UPDATE employee SET email = ?, name = ?, active = ? WHERE id = ?",
    [empleado.email, empleado.name, empleado.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Empleado with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated empleado: ", { id: id, ...empleado });
      result(null, { id: id, ...empleado });
    }
  );
};

Empleado.remove = (id, result) => {
  sql.query("DELETE FROM employee WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Empleado with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted empleado with id: ", id);
    result(null, res);
  });
};

Empleado.removeAll = result => {
  sql.query("DELETE FROM employee", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} empleados`);
    result(null, res);
  });
};

module.exports = Empleado;