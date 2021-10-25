const express = require('express');
const app = express();

app.use("/images", express.static('images'));

const PORT = process.env.PORT || 5000;
const cors = require('cors');
var bodyparser = require('body-parser');
const formidable = require('express-formidable');
const fs = require('fs');

var accessLogStream = fs.createWriteStream('./api.log', { flags: 'a' })
const morgan = require('morgan');


app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended : true}));
app.use(formidable({ multiples : true}));
app.use(morgan('combined',{ stream : accessLogStream}));

require('./routes/index')(app);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})