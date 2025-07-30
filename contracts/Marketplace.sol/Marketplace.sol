// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        uint price;
        address payable farmer;
        bool sold;
    }

    uint public productCount;
    mapping(uint => Product) public products;

    // Events
    event ProductListed(uint id, string name, uint price, address indexed farmer);
    event ProductPurchased(uint id, address indexed buyer, address indexed farmer);

    // List a product by a farmer
    function listProduct(string memory _name, uint _price) public {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        productCount++;
        products[productCount] = Product(productCount, _name, _price, payable(msg.sender), false);
        emit ProductListed(productCount, _name, _price, msg.sender);
    }


    // Buy a product
    function buyProduct(uint _id) public payable {
        Product storage product = products[_id];
        require(_id > 0 && _id <= productCount, "Product does not exist");
        // Ensure sufficient funds for product price and transaction fee
        require(msg.value >= product.price, "Insufficient funds to cover product price and transaction fee");
        require(!product.sold, "Product already sold");
        // Transfer payment to the farmer
        product.farmer.transfer(msg.value);

        // Mark product as sold
        product.sold = true;

        emit ProductPurchased(_id, msg.sender, product.farmer);
    }

    // View product details
    function getProduct(uint _id) public view returns (string memory, uint, address, bool) {
        require(_id > 0 && _id <= productCount, "Product does not exist");
        Product memory product = products[_id];
        return (product.name, product.price, product.farmer, product.sold);
    }
}