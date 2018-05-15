// require node/npm packages

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


// create the connection information for the sql database

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database

connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to show products and prompt the user
  start();
});

function start() {
    inquirer
        .prompt({
            name: "managerChoice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory", 
                "Add New Product"
            ]
        })
        .then(function(answer) {
            switch (answer.managerChoice) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                   
                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    newProduct();
                    break;
            }
        })
};


function viewProducts () {
    connection.query('SELECT * FROM Products', function(err, res){
        if(err) throw err;
        
        console.log('\n Product List:')
        console.log(' ==============')
        // console.log(JSON.stringify(res, null, 2));

        // for (var i = 0; i < res.length; i++) {
        //     console.log(`Item ID: ${res[i].item_id} \n Product Name: ${res[i].product_name} \n Department: ${res[i].department_name} \n Price: ${res[i].price} \n Quantity: ${res[i].stock_quantity} \n =================`);
        // }

        // use the cli-table npm package to display a real product table
        var bamazonTable = new Table ({
        	head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
            //row widths
        	colWidths: [10, 20, 15, 10, 15]
        });

        // loop over the results (database table) to display all information
        for (var i = 0; i < res.length; i++){
			bamazonTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		};
        // necessary table formatting
        console.log(bamazonTable.toString());

        // console.log("     Product List Generated")
        console.log(" \n ")

        start();
    });
    // connection.end();
}

function viewLowInventory () {
    connection.end();
}

function addInventory () {
    console.log("you are a real G")
    connection.end();
}

function newProduct () {
    connection.end();
}



// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

