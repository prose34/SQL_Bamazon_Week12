# SQL_Bamazon_Week12

Created during Week 12 of the SMU Full Stack Developer/Coding Bootcamp. Node.js, Inquirer, and MySQL were used to create a functional store front.

## Getting Started

- Clone repo
- Run command 'npm install' in Terminal or Gitbash 
- Run one of these commands depending which mode you would like to use:
    * Customer - 'node bamazonCustomer'
    * Manager - 'node bamazonManager'
    * Supervisor - 'node bamazonSupervisor'
- Run 'ctrl + c' if you want to quit

### What Each Mode Does:

1. `bamazonCustomer.js`

    * Prints the products in the store.

    * Prompts customer which product they would like to purchase by ID number.

    * Asks for the quantity to purchase.

      * If there is a sufficient amount of the product in stock, it will return the total cost for that purchase.
      * However, if there is not enough of the product in stock, it will tell the user that there isn't enough of the product.
      * If the purchase goes through, it updates the stock quantity to reflect the purchase.
      * It will also update the product sales in the department table.

-----------------------

2. `bamazonManager.js`

    * Starts with a menu:
        * View Products for Sale
        * View Low Inventory
        * Add to Inventory
        * Add New Product
        * Exit

    * If the user selects `View Products for Sale`, all of the products and information will be displayed.

    * If the user selects `View Low Inventory`, the products with five or fewer items remaining are displayed.

    * If the user selects `Add to Inventory`, the user can select a product and add to it's stock quantity.

    * If the user selects `Add New Product`, the user can add a new product to the store.

    * If the user selects `Exit`, the sql connection and session will end. 

-----------------------

3. `bamazonExecutive.js`

    * Starts with a menu:
        * View Product Sales by Department
        * Create New Department
        * Exit

    * If the user selects `View Product Sales by Department`, the Department Sales, overhead costs and profits are displayed.

    * If the user selects `Create New Department`, the user may create a new department and input current overhead costs and product sales. If there are none, by default it will set at 0.

    * If the user selects `Exit`, the sql connection and session will end. 

## Demo Videos

* bamazonCustomer.js (https://www.youtube.com/watch?v=wWY79eIjCwg)

* bamazonManager.js (https://www.youtube.com/watch?v=wWY79eIjCwg)

* bamazonExecutive.js (Youtube Link - Coming soon!)

## Technologies used
- Node.js
- Inquire NPM Package (https://www.npmjs.com/package/inquirer)
- MYSQL NPM Package (https://www.npmjs.com/package/mysql)

### Prerequisites

```
- Node.js - Download the latest version of Node https://nodejs.org/en/
- Create a MYSQL database called 'bamazon', reference schema.sql
```

## Built With

* VSCode - Text Editor
* Sequel Pro
* Terminal

## Authors

[Paul Rose](https://github.com/prose34)