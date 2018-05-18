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
                "Add New Product",
                "Exit"
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
                
                case "Exit":
                    console.log("  Goodbye!")
                    connection.end();
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
    connection.query('SELECT * FROM Products WHERE stock_quantity < 6', function(err, res){ //view only products with inventory of 5 or less
        if(err) throw err;
        
        console.log('\n Low Inventory List:')
        console.log(' ==============')

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






function addInventory () { //add inventory to any product
    connection.query('SELECT * FROM Products', function(err, res){
        if(err) throw err;

        console.log('\n Product List:')
        console.log(' ==============')

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

        inquirer //start asking the manager what product to add inventory to
            .prompt([
                {
                    name: "inventoryID",
                    type: "input", //id of product
                    message: "What is Item ID of the product you would like update?",
                    validate: function(inventoryID) {
                        if(isNaN(inventoryID) == false && inventoryID % 1 == 0 && parseInt(inventoryID) <= res.length && parseInt(inventoryID) > 0) {
                            return true; //here we check to make sure the input was a number smaller than product list length and greater than 0
                        } else {
                            console.log(`\n Please enter a valid product ID number between ${res[0].item_id} and ${res[res.length - 1].item_id}`);
                            return false;
                        }
                    }
                },
                {
                    name: "newInventoryAdded",
                    type: "input",
                    message: "Enter the quantity to add.",
                    validate: function(newInventoryAdded) {
                        if(isNaN(newInventoryAdded) == false && newInventoryAdded % 1 == 0 && parseInt(newInventoryAdded) > 0) {
                            return true; //here we check to make sure the input was a number greater than 0
                        } else {
                            console.log(`\n Please enter a quantity greater than 0`);
                            return false;
                        }
                    }
                }
            ]).then(function (answer) {

                var currentInventory = 0;

                // console.log(answer);
                // console.log(JSON.stringify(res, null, 2));

                for(var i=0; i<res.length; i++) {
                    if(res[i].item_id == answer.inventoryID) {
                        currentInventory = res[i].stock_quantity;
                        // console.log(res[i].item_id);
                        // console.log(answer.inventoryID);
                    }
                }

                
                // console.log(currentInventory);

                connection.query('UPDATE Products SET ? WHERE ?', [
                    {
                        stock_quantity: currentInventory + Number(answer.newInventoryAdded)
                    },
                    {
                        item_id: answer.inventoryID
                    }
                ], function(error, response){
                    if(error) throw error;

                    // console.log(JSON.stringify(response, null, 2));
                    // console.log(JSON.stringify(res, null, 2));
                    // console.log(answer.inventoryID);

                    console.log('\n =====================')
                    console.log(` You have successfully added ${answer.newInventoryAdded} units to ${res[Number(answer.inventoryID) - 1].product_name}`)
                    console.log(' =====================')

                    showProductTable();

                    // console.log("it works so far");
                    //say how much was added


                // connection.query('SELECT * FROM Products', function(err, res){
                //     if(err) throw err;

                // if(answer.additionalOrder == true) {
                //     start();
                // } else {
                //     console.log(" Goodbye, please come back to purchase from Bamazon again soon!");
                //     connection.end();
                // }

                });

            });

    });
}







function newProduct () {
    
    // connection.end();
}








function showProductTable () {
    connection.query('SELECT * FROM Products', function(err, res){
        if(err) throw err;

        console.log('\n Product List:')
        console.log(' ==============')

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


        console.log("\n Product List Updated!")
        console.log(' =====================')

        console.log(" \n ")

        start();
    });    
}
