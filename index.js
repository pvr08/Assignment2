/*
ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
** Name: Vamshidhar Reddy
Student ID: N01546921 
Date: 02/11/2023
*/
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars'); 

const handlebars = require('handlebars');

// Register a Handlebars helper to get a property from an object
handlebars.registerHelper('getProperty', function (obj, key) {
  return obj[key];
});
// Register a Handlebars helper to check if two values are not equal
handlebars.registerHelper('notequal', function (obj, key) {
  return obj !== key;
});

// Register a Handlebars helper to display rating “0” to “zero” with a highlight
handlebars.registerHelper('RatingIsZero', function (rating, options) {
  if (rating === 0) {
    return new handlebars.SafeString('<span class="highlight">zero</span>');
  }
  return rating;
});

// Register a Handlebars helper to check if two values are equal
handlebars.registerHelper('equal', function (obj, key) {
  return obj == key;
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); 

let carSalesData;

// Read and load the json file
fs.readFile('ite5315-A1-Car_sales.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
  } else {
    // Parse the JSON data and store it in the carSalesData variable
    carSalesData = JSON.parse(data).carSales;
    console.log('JSON data is loaded and ready!');
  }
});

let superSalesData; 
// Read and load the SuperSales.json file
fs.readFile('SuperSales.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading SuperSales.json file:", err);
  } else {
    // Parse the JSON data and store it in the superSalesData variable
    superSalesData = JSON.parse(data);
    console.log('Json data is loaded and ready!');
  }
});


app.get('/', (req, res) => {
  res.render('index', { title: 'Express' ,activeHome: true});
});


//step6- route 1
app.get('/data', (req, res) => {
  if (!carSalesData) {
    return res.send("Data not loaded");
  }
  res.render('allData', { carSalesData: 'data is loaded and ready', activeData: true  }); 
});

//step6- route 2
app.get('/data/invoiceNo/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (carSalesData && index >= 0 && index < carSalesData.length) {
    const car = carSalesData[index];
    res.render('invoiceNo', { car }); 
  } else {
    res.send("Invalid index or data not loaded");
  }
});

//step6- route 3
app.get('/search/invoiceNo', (req, res) => {
  res.render('searchInvoiceNoForm',{activeInvoiceNo:true}); 
});
app.post('/search/invoiceNo', (req, res) => {
  if (!carSalesData) {
    return res.send("Data not loaded");
  }

  const searchInvoiceNo = req.body.invoiceNo;
  const foundCar = carSalesData.find(car => car.InvoiceNo === searchInvoiceNo);

  if (foundCar) {
    res.render('invoiceNoResult', { car: foundCar, activeInvoiceNo:true });
  } else {
    res.send("InvoiceNo not found");
  }
});



//step6- route 4
app.get('/search/Manufacturer', (req, res) => {
  res.render('searchManufacturerForm',{activeManufacturer:true}); 
});
app.post('/search/Manufacturer', (req, res) => {
  if (!carSalesData) {
    return res.send("Data not loaded");
  }

  const searchManufacturer = req.body.manufacturer;
  const matchedCars = carSalesData.filter(car =>
    car.Manufacturer.toLowerCase().includes(searchManufacturer.toLowerCase())
  );

  if (matchedCars.length > 0) {
    res.render('manufacturerResult', { cars: matchedCars,activeManufacturer:true });
  } else {
    res.send("No cars matching the Manufacturer found");
  }
});

//Step7
app.get('/viewData', (req, res) => {
  if (!superSalesData) {
    return res.send("Data not loaded");
  }
  res.render('viewData', { superSalesData, activeViewData:true });
});




// Route for handling errors
app.all("*", (req, res) => {
  res.status(404).render('error', { title: 'Error', message: 'Page not found' }); 
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
