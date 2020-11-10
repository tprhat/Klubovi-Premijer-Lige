const express = require('express');
const path = require('path');
const app = express();

//routes
const indexRouter = require('./routes/index.routes');
const datableRouter = require('./routes/datatable.routes');
const downloadCSVRouter = require('./routes/downloadCSV.routes'); 
const downloadJSONRouter = require('./routes/downloadJSON.routes');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/datatable', datableRouter);
app.use('/downloadCSV', downloadCSVRouter);
app.use('/downloadJSON', downloadJSONRouter);

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
    if (!err) {
       console.log(`App started on port ${port}`);
    } else {
      console.log(err);
    }
  });
  

module.exports = app; 