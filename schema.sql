DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price DECIMAL (10, 4) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
)


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Math Textbook", "Books", 200, 100),
    ("Macbook Pro", "Electronics", 2000, 4),
    ("Xbox Game", "Electronics", 50, 10000),
    ("Comic Book", "Books", 2.99, 30000),
    ("Tesla Model S", "Vehicles", 75000, 5),
    ("Toothbrush", "Hygiene", 34.99, 12000),
    ("Designer Shirt", "Clothing", 99.99, 175),
    ("Blu-ray DVD", "Electronics", 24.99, 1000),
    ("Cinder Block", "Materials", 1, 350),
    ("Waffles", "Food", 5, 5000),
    ("Old Shoes", "Clothing", 9.99, 500);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (department_id)
)