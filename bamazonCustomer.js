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

function start(){
    //prints the items for sale and their details
    connection.query('SELECT * FROM Products', function(err, res){
        if(err) throw err;
        
        console.log('\n Welcome to Bamazon - BUY SOME OF OUR STUFF!')
        console.log(' ===========================================')
        // console.log(JSON.stringify(res, null, 2));

        // for (var i = 0; i < res.length; i++) {
        //     console.log(`Item ID: ${res[i].item_id} \n Product Name: ${res[i].product_name} \n Department: ${res[i].department_name} \n Price: ${res[i].price} \n Quantity: ${res[i].stock_quantity} \n =================`);
        // }

        // use the cli-table npm package to display a real product table
        var bamazonTable = new Table ({
            // chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
            //     , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
            //     , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
            //     , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },

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

        // call a new function to prompt the customer
        // I could have pulled this out of the start function (and that's the proper thing to do). 
        // I orignallly did it like this to have access to the results (res) information, but could have just made another 
        // connection.query call to grab the info. 
        customerPrompt();

        function customerPrompt () {
            inquirer //use inquier to prompt the user for item and quantity inputs. user validation in the if statements
                .prompt([
                  {
                    name: "customerIDinput",
                    type: "input",
                    message: "Please enter the ID number of the product you would like to purchase",
                    validate: function(customerIDinput) {
                        if(isNaN(customerIDinput) == false && customerIDinput % 1 == 0 && parseInt(customerIDinput) <= res.length && parseInt(customerIDinput) > 0) {
                            return true; //here we check to make sure the input was a whole number smaller than product list length and greater than 0
                        } else {
                            console.log(`\n Please enter a valid product ID number between ${res[0].item_id} and ${res[res.length - 1].item_id}`);
                            return false;
                        }
                    }
                  },
                  {
                    name: "customerQuantityInput",
                    type: "input",
                    message: "How many would you like to purchase?",    
                    validate: function(customerQuantityInput) {
                        if(isNaN(customerQuantityInput) == false && customerQuantityInput % 1 == 0 && parseInt(customerQuantityInput) > 0) {
                            return true; //more user validation
                        } else {
                            console.log("\n Please enter a valid quantiy");
                            return false;
                        }
                    }
                  }
                ]).then(function(answer) { //show the user chosen products and move onto confirming the order
                    console.log('=================================')
                    console.log(`You chose ID# ${answer.customerIDinput} - ${res[answer.customerIDinput - 1].product_name}`);
                    console.log(`You selected ${answer.customerQuantityInput} of them`);
                    console.log('=================================')

                    // add a confirm to prompt for user - cycle back to beginning if no. confirm order
                    // this prompt let's the user confirm or restart their order
                    inquirer 
                        .prompt(
                          {
                            name: "customerConfirm",
                            type: "confirm",
                            message: "Are these the items that you want to purchase?",
                          }
                        ).then(function(answer2) {

                            // console.log(answer2.customerConfirm);
                            // console.log(answer.customerIDinput);
                            
                            if(answer2.customerConfirm == true) {
                                // pass in the item number and purchase quantity
                                // console.log("\n Our inventory levels have been updated");
                                // console.log(' ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                                confirmOrder(answer.customerIDinput, answer.customerQuantityInput);
                            } else {
                                console.log("\n YOU CHOSE TO CANCEL, PLEASE RESELECT ITEMS FOR PURCHASE");
                                console.log(' ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')

                                start();
                            }
                        });      
                });
                
        };        
    });
};

function confirmOrder (productIDnumber, purchaseQuantity) {
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM Products', function(err, res){
        if(err) throw err;

        // console.log(res);
        // user validation for quantity requested
        if (purchaseQuantity <= res[productIDnumber - 1].stock_quantity) {
            console.log('=================================')
            console.log('Congrats! Your order is now complete.');
            console.log(`Your total is: $${purchaseQuantity * res[productIDnumber - 1].price}`);
            console.log('=================================')

            // update database if the purchase is successful
            connection.query('UPDATE products SET ? WHERE ?', [ //sql query syntax - arrray double ?'s
                { stock_quantity: res[productIDnumber - 1].stock_quantity - purchaseQuantity },
                { item_id: productIDnumber }
            ], function(err, res) {
                // console.log(JSON.stringify(res, null, 2));
            })

            additionalOrderPrompt();
            // as user if they want new order or nah

        } else {
            console.log(`Apologies, your order could not be completed. We only have ${res[productIDnumber - 1].stock_quantity} in stock at the moment.`);
            // prompt user to change order or place a new order if the quantity is invalid
            additionalOrderPrompt();
        }
    });
};

// function to ask the user if they want to place another order or exit bamazon
function additionalOrderPrompt () {
    inquirer
        .prompt(
            {
                name: "additionalOrder",
                type: "confirm",  //yes or no prompt
                message: "World you like to place another order?"
            }
        ).then(function (answer) {
            if(answer.additionalOrder == true) {
                start();
            } else {
                console.log(" Goodbye, please come back to purchase from Bamazon again soon!");
                connection.end();
            }
        });
};