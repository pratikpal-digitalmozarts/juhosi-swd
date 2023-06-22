const express = require('express');
const app = express();
const pool = require('./db');

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page route
app.get('/', (req, res) => {
  res.render('home');
});

// Login form submission route
app.post('/login', (req, res) => {
  const { userId, password } = req.body;
//   console.log(req.body)
    const sqlQuery = "Select * from auth where id='"+userId+"' and password='"+password+"'"
    // console.log(sqlQuery)
    pool.query(sqlQuery, (err, result) => {
        console.log("error", err)
        // console.log("result", result)
        if(Object.keys(result).length > 0){
            if(result[0]["id"] === "admin"){
                console.log("This is running...", result)
                res.redirect('/dashboard');
            }
            else{
                res.render('customer', { result });
            }
        }
        else{
            
            res.render('home', { result });
        }
    })
//   if(userId === password){
//     res.render('home')
//   }

//   res.redirect('/dashboard');
});

// Dashboard page route
app.get('/dashboard', (req, res) => {
  // Fetch user data from the database and pass it to the dashboard view
  // You can query the database using the MySQL connection pool
    let sqlQuery = "Select * from details";
  pool.query(sqlQuery, (err, result) => {
    console.log("Error", err);
    // console.log(result);
    ///////////////////////////////////////////////////////////////////////////////////////////

    let QntCust1 = 0;
    let QntCust2 = 0;
    let QntTotal = 0;

    let WghtCust1 = 0;
    let WghtCust2 = 0;
    let WghtTotal = 0;

    let BoxCntCust1 = 0;
    let BoxCntCust2 = 0;
    let BoxCntTotal = 0;
    for(let i=0; i<result.length ; i++){
        for(const key in result[i]){
            if(key === "customer"){
            if(result[i][key] === "customer1"){
                QntCust1 = QntCust1 + result[i]["Quantity"];
                WghtCust1 = WghtCust1 + result[i]["weight"];
                BoxCntCust1 = BoxCntCust1 + result[i]["box_count"];
            }
            if(result[i][key] === "customer2"){
                QntCust2 = QntCust2 + result[i]["Quantity"];
                WghtCust2 = WghtCust2 + result[i]["weight"];
                BoxCntCust2 = BoxCntCust2 + result[i]["box_count"];
            }
            }
            else continue;
        }
    }
    QntTotal = QntCust1 + QntCust2;
    WghtTotal = WghtCust1+ WghtCust2;
    BoxCntTotal = BoxCntCust1 + BoxCntCust2;
    let userData =[ { item: "Quantity" , Cust1: QntCust1, Cust2k:QntCust2, Totalk: QntTotal},
    {item: "Weight" , Cust1: WghtCust1, Cust2k:WghtCust2, Totalk: WghtTotal}, 
    {item: "Box Count" , Cust1: BoxCntCust1, Cust2k:BoxCntCust2, Totalk: BoxCntTotal} ];
    ///////////////////////////////////////////////////////////////////////////////////////////
    res.render('dashboard', { userData });
  })

});


app.post('/submit', (req, res) =>{
    const { order_date, company, owner, item, quantity, weight, request_for_ship, tracking_id, shipment_size, box_count, specification, checklist, customer } = req.body;
    let xP = 0;
    for(let i=0; i<shipment_size.length; i++){
        if(shipment_size[i] === 'x') xP = xP+1;
    }
    
    if(xP != 2){
        let result = [ { id : customer, pass : "adjai"} ] 
        res.render('customer', { result , xP });
    }
    let shipment_size2 = shipment_size
    for(let i=0; i<2; i++){
        shipment_size2 = shipment_size2.replace('x', '*');
    }

    let int_shipment_size = eval(shipment_size2);
    let intQuantity = eval(quantity);
    let intweight = eval(weight);
    let intBox = eval(box_count);
    let cust = customer.trim();
    const sqlQuery = "INSERT INTO details( customer, order_date, company, owner, item, Quantity, weight, request_for_ship, tracking_id, shipment_size, box_count, specification, checklist ) VALUES ( '"+cust+"','"+order_date+"','"+company+"','"+owner+"','"+item+"',"+intQuantity+","+intweight+",'"+request_for_ship+"','"+tracking_id+"',"+int_shipment_size+","+intBox+",'"+specification+"','"+checklist+"')"

    // console.log(sqlQuery);
    pool.query(sqlQuery, (err, result) => {
        // console.log("error", err)
        console.log("result successfull", result)
    })
    console.log(req.body);
    res.redirect('/')
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});