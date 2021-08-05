const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');

app.use(express.static('public'))

app.set('views',        __dirname+'/views/');
app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    extname: 'hbs'
}));

require("./routes/empleados.routes.js")(app);
require("./routes/skills.routes.js")(app);

app.listen(8080, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});