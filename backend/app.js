// Initialize Web3 with Ganache provider
const ganacheUrl = "http://127.0.0.1:7545"; // Ganache RPC URL
const web3 = new Web3(ganacheUrl);  // Web3 initialization

// Hardcoded login credentials for Farmer and Buyer
const loginCredentials = {
    farmer: { username: 'farmer1', password: 'farmer123' },
    buyer: { username: 'buyer1', password: 'buyer123' }
};

// Store the logged-in user's role
let currentUserRole = null;

const account = {
    address: "0x1c086754E4D2fB09C4427BDAcc4107DD88CfA5eA",  // Replace with your Ganache account address
    privateKey: "0xd4d3e9ea48a16c676281565a2ecd17f3c1654fe4b8e2be11afede7bb2de879a6" // Replace with the corresponding private key
};

const contractAddress = "0xa6E2FcaAB2E40e61d2B016643fcf4433BBa63f42"; // Your contract's deployed address
const abi = [
    {
        "inputs": [],
        "name": "productCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "products",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "farmer",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "sold",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "listProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "buyProduct",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getProduct",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

const marketplace = new web3.eth.Contract(abi, contractAddress);

// Login function
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("login-message");

    // Check login credentials
    if (username === loginCredentials.farmer.username && password === loginCredentials.farmer.password) {
        currentUserRole = 'farmer';
        loginMessage.textContent = "Logged in as Farmer";
        showFarmerSection();
    } else if (username === loginCredentials.buyer.username && password === loginCredentials.buyer.password) {
        currentUserRole = 'buyer';
        loginMessage.textContent = "Logged in as Buyer";
        showBuyerSection();
    } else {
        loginMessage.textContent = "Invalid credentials!";
    }
}

// Show farmer section
function showFarmerSection() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("product-section").style.display = "block";
    document.getElementById("user-role").textContent = "Farmer";

    // Hide Buyer section and show Farmer section
    document.getElementById("buyer-section").style.display = "none";
    document.getElementById("farmer-section").style.display = "block";
}

// Show buyer section
function showBuyerSection() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("product-section").style.display = "block";
    document.getElementById("user-role").textContent = "Buyer";

    // Hide Farmer section and show Buyer section
    document.getElementById("farmer-section").style.display = "none";
    document.getElementById("buyer-section").style.display = "block";
}

// Farmer: List Product
async function listProduct() {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const priceInEther = parseFloat(document.getElementById("productPrice").value);
    const priceInWei = web3.utils.toWei(priceInEther.toString(), 'ether');
    
    if (name && price) {
        try {
            // Encode the function call
            const data = marketplace.methods.listProduct(name, price).encodeABI();

            // Create the transaction object
            const tx = {
                to: contractAddress,
                data: data,
                gas: 2000000,  // Set a gas limit (you may need to estimate this based on your contract's complexity)
                gasPrice: await web3.eth.getGasPrice(),  // Fetch the current gas price
                from: account.address // Set the 'from' address
            };

            // Sign the transaction with the private key
            const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);

            // Send the signed transaction
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            alert("Product listed successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to list product.");
        }
    } else {
        alert("Please provide product details.");
    }
}

// Assuming you have already set up web3 and your contract instance

// Function to get all products from the blockchain
async function getProducts() {
    const productCount = await marketplace.methods.productCount().call();  // Get total product count
    let products = [];

    // Loop through all products and fetch their details
    for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        products.push({
            id: product.id,
            name: product.name,
            price: web3.utils.fromWei(product.price.toString(), 'ether'),  // Convert price from Wei to Ether
            farmer: product.farmer,
            sold: product.sold
        });
    }
    return products;
}

// Function to view the products (for buyer)
async function viewProducts() {
    const products = await getProducts();  // Fetch products from the blockchain

    // Display products in the frontend
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = '';  // Clear any previous list

    if (products.length === 0) {
        productListDiv.innerHTML = 'No products available.';
    } else {
        products.forEach((product) => {
            if (!product.sold) {  // Only show products that are not sold
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <p>Product Name: ${product.name}</p>
                    <p>Price: ${product.price} ETH</p>
                    <button onclick="buyProduct(${product.id})">Buy</button>
                `;
                productListDiv.appendChild(productDiv);
            }
        });
    }
}

// Function to buy a product
async function buyProduct(productId) {
    try {
        // Fetch product details
        const product = await marketplace.methods.products(productId).call();
        const productPriceWei = product.price; // Price in Wei
        const productName = product.name;
        const productFarmer = product.farmer;

        console.log("Product Name:", productName);
        console.log("Product Price (Wei):", productPriceWei.toString());  // Price in Wei
        console.log("Farmer Address:", productFarmer);

        // Get the buyer's account
        const accounts = await web3.eth.getAccounts();
        const buyerAddress = accounts[0];

        // Get buyer's balance (in Wei)
        const balanceWei = await web3.eth.getBalance(buyerAddress);
        console.log("Buyer balance (Wei):", balanceWei);

        // Ensure the buyer has enough funds (compare balance with product price in Wei)
        if (BigInt(balanceWei) < BigInt(productPriceWei)) {
            alert("Insufficient funds!");
            return;
        }

        // Set up and send the transaction to buy the product
        const tx = await marketplace.methods.buyProduct(productId).send({
            from: buyerAddress,
            value: productPriceWei, // Product price in Wei
            gas: 3000000,  // Set the gas limit
        });

        console.log('Transaction successful:', tx.transactionHash);
        alert("Product bought successfully!");

    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed: " + error.message);
    }
}