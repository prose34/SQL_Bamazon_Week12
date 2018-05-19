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
            name: "supervisorChoice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.supervisorChoice) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                   
                case "Create New Department":
                    createDepartment();
                    break;
                
                case "Exit":
                    console.log("  Goodbye!")
                    connection.end();
                    break;
            }
        })
};




function viewProductSales () {

}









function createDepartment () {
    connection.query('SELECT * FROM departments', function(err, res) {
        if(err) throw err;

        inquirer
            .prompt([
                {
                    name: "departmentName",
                    type: "input",
                    message: "Enter the department name."
                },
                {
                    name: "overheadCosts",
                    type: "input",
                    message: "Enter the overhead costs for this department.",
                    validate: function(overheadCosts) {
                        if(isNaN(overheadCosts) == false && overheadCosts % 1 == 0 && parseInt(overheadCosts) > 0) {
                            return true; //more user validation
                        } else {
                            console.log("\n Please enter a valid quantiy");
                            return false;
                        }
                    }
                }
            ]).then(function(answer) {

                connection.query("INSERT INTO departments SET ?", 
                    {
                        department_name: answer.departmentName,
                        over_head_costs: answer.overheadCosts
                    }, 
                    function(error, response){
                        if(error) 
                            throw error;

                        console.log("\n Department added successfully.");
                        console.log(' ======================================')

                        showDepartmentTable();
                    }); 



            })
    })
}



function showDepartmentTable () {
    connection.query('SELECT * FROM departments', function(err, res){
        if(err) throw err;

        console.log('\n Department List:')
        console.log(' ==================')

        // use the cli-table npm package to display a real product table
        var bamazonDepartmentTable = new Table ({
        	head: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"],
            //row widths
        	colWidths: [20, 20, 15, 15, 15]
        });

        // loop over the results (database table) to display all information
        for (var i = 0; i < res.length; i++){
			bamazonDepartmentTable.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
		};
        // necessary table formatting
        console.log(bamazonDepartmentTable.toString());


        console.log("\n Department List Updated!")
        console.log(' =====================')

        console.log(" \n ")

        start();
    });    
}