// Initialize Web3 with Ganache provider
const ganacheUrl = "http://127.0.0.1:7545"; // Ganache RPC URL
const web3 = new Web3(ganacheUrl);  // Web3 initialization
// Log Web3 version to confirm
console.log("Web3 Initialized: ", web3.version);

// Hardcoded login credentials for Farmer and Buyer
const loginCredentials = {
    farmer: { username: 'farmer1', password: 'farmer123' },
    buyer: { username: 'buyer1', password: 'buyer123' }
};

// Store the logged-in user's role
let currentUserRole = null;

const account = {
    address: "0xAC5Ef19342D9b1867F76831Db809bA24b3981D11",  // Replace with your Ganache account address
    privateKey: "0xfe556268fed7b52dbfd110b225f9c617cf418d129854e7f2680d1bc4f263dc16" // Replace with the corresponding private key
};

const contractAddress = "0x7685c0D979f474ff61255160B9988FE195A3086a"; // Your contract's deployed address
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
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate inputs
    if (!username || !password) {
        alert("Both username and password are required.");
        return;
    }

    // Send login request to backend
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            currentUserRole = data.role;
            alert(`Logged in as ${data.role}`);

            if (data.role === 'farmer') {
                showFarmerSection();
            } else {
                showBuyerSection();
            }
        } else {
            alert(data.message || "Login failed.");
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("An error occurred during login.");
    }
}

// create function
async function Create() {
    const username = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value; // Get the selected role

    // Validate inputs
    if (!username || !password || !confirmPassword || !role) {
        alert("All fields are required.");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Send data to the backend
    try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            switchToLogin(); // Redirect to login form
        } else {
            alert(data.error || "Signup failed.");
        }
    } catch (err) {
        console.error("Signup error:", err);
        alert("An error occurred during signup.");
    }
}



// Show farmer section
function showFarmerSection() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("product-section").style.display = "block";
    document.getElementById("user-role").textContent = "Farmer";

    // Hide Buyer section
    document.getElementById("buyer-section").style.display = "none";
    document.getElementById("farmer-section").style.display = "block";
}


// Show buyer section
function showBuyerSection() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("product-section").style.display = "block";
    document.getElementById("user-role").textContent = "Buyer";

    // Hide Farmer section
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

function logout() {
    // Reset UI or clear user-related data if necessary
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('product-section').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    // Redirect to home (optional, if homepage is different)
     location.href = 'home.html';
    alert('You have been logged out.');
}

// Function to switch to the signup form
function switchToSignUp() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
}

// Function to switch to the login form
function switchToLogin() {
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
}
