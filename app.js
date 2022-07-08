/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const express = require('express')
const app = express()
app.use(express.json())

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { application } = require('express');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function insertsslc(regno,mob,name,marks,school,passout,board) {
	try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			var result =await contract.submitTransaction('Createsslc',regno,mob,name,marks,school,passout,board);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				return prettyJSONString(result.toString());
			}

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function inserthse(regno,mob,name,marks,school,passout,board){
	try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);
		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			var result =await contract.submitTransaction('Createhse',regno,mob,name,marks,school,passout,board);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				return prettyJSONString(result.toString());
			}

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function insertug(regno,mob,name,marks,college,specialization,passout,university ){
	try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);
		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			var result =await contract.submitTransaction('Createug',regno,mob,name,marks,college,specialization,passout,university);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				return prettyJSONString(result.toString());
			}

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function read(regno){
	try {
		const ccp = buildCCPOrg1();
		const wallet = await buildWallet(Wallets, walletPath);
		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			
			var result = await contract.evaluateTransaction('ReadCertificate', regno);
			console.log(prettyJSONString(result.toString()));
			return prettyJSONString(result.toString());

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}
async function insertexp(empid,mob,name,company,start_date,end_date,designation,lpa){
	try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);
		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			var result =await contract.submitTransaction('Createexp',empid,mob,name,company,start_date,end_date,designation,lpa);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
				return prettyJSONString(result.toString());
			}

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function read(regno){
	try {
		const ccp = buildCCPOrg1();
		const wallet = await buildWallet(Wallets, walletPath);
		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);
			
			var result = await contract.evaluateTransaction('ReadCertificate', regno);
			console.log(prettyJSONString(result.toString()));
			return prettyJSONString(result.toString());

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}
//insertsslc("315321","9496797157","Sajith Surendran","98","SDVHSS","2009","Kerala");
//inserthse("7179636","9496797157","Sajith Surendran","98","VBHSS","2011","Kerala");
//insertug("EPALECS046","9496797157","Sajith Surendran","98","GEC PKD","CSE","2015","Calicut Univeristy")
//read("315321")
//read("7179636");
//read("EPALECS046")


app.get('/verify', async function(req, res) {
	var regno = req.query.regno
	var result = await read(regno);
	console.log('--- Blockchain Read Opreation ---');
	res.send(result);
  
});

// signature regno,mob,name,marks,school,passout,board
app.post('/sslc', async function(req, res) {
	var result = await insertsslc(
		req.body.regno,
		req.body.mob,
		req.body.name,
		req.body.marks,
		req.body.school,
		req.body.passout,
		req.body.board);
	console.log('--- Blockchain Write Opreation ---')
	res.send(result);
});


// signature regno,mob,name,marks,school,passout,board
app.post('/hse', async function(req, res) {
	console.log(req.body.regno, req.body.mob, req.body.name, req.body.marks,req.body.school,req.body.passout,req.body.board)
	var result = await inserthse(
		req.body.regno,
		req.body.mob,
		req.body.name,
		req.body.marks,
		req.body.school,
		req.body.passout,
		req.body.board);
	res.send(result);
});

// signature regno,mob,name,marks,college,specialization,passout,university
app.post('/ug',async function(req, res){
	var result = await insertug(
		req.body.regno,
		req.body.mob,
		req.body.name,
		req.body.marks,
		req.body.college,
		req.body.specialization,
		req.body.passout,
		req.body.university);
	res.send(result);
});

app.post('/exp', async function(req, res) {
	var result = await insertexp(
		req.body.empid,
		req.body.mob,
		req.body.name,
		req.body.company,
		req.body.start_date,
		req.body.end_date,
		req.body.designation,
		req.body.lpa,
	);
	res.send(result);
});
app.listen(3000)