const contractAddress = "0x545ec228E9F676CFDFb9c75225707dB4029646d5"; // Deployed contract address
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "applicant",
                "type": "address"
            }
        ],
        "name": "Applied",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Donated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsReleased",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "applicants",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "applyForScholarship",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "releaseFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonations",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let accounts;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('account').innerText = `Connected: ${accounts[0]}`;
            updateConnectionStatus(true, accounts[0]);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.error("User denied account access", error);
            updateConnectionStatus(false);
        }
    } else {
        alert("Please install MetaMask!");
        updateConnectionStatus(false);
    }
}

async function donate() {
    const amount = document.getElementById('donationAmount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid donation amount");
        return;
    }
    try {
        await contract.methods.donate().send({
            from: accounts[0],
            value: web3.utils.toWei(amount, 'ether')
        });
        alert("Donation successful!");
    } catch (error) {
        console.error("Donation failed", error);
        alert("Donation failed: " + error.message);
    }
}

async function applyForScholarship() {
    try {
        await contract.methods.applyForScholarship().send({ from: accounts[0] });
        alert("Application submitted!");
    } catch (error) {
        console.error("Application failed", error);
        alert("Application failed: " + error.message);
    }
}

async function releaseFunds() {
    const recipient = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('releaseAmount').value;
    if (!web3.utils.isAddress(recipient)) {
        alert("Please enter a valid Ethereum address");
        return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    try {
        await contract.methods.releaseFunds(recipient, web3.utils.toWei(amount, 'ether')).send({ from: accounts[0] });
        alert("Funds released successfully!");
    } catch (error) {
        console.error("Funds release failed", error);
        alert("Funds release failed: " + error.message);
    }
}