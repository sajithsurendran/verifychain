/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                Regno : "7179636",
                Grade : "A",
                Name: "Sajith Surendran",
                Subject: "CSE",
                Passout: "2015",
                Institution: "Government Engineering College Palakkad",
                University: "Calicut University",
            },
            {
                Regno : "7179545",
                Grade : "A",
                Name: "Saya Surendran",
                Subject: "CSE",
                Passout: "2017",
                Institution: "Government Engineering College Thrissur",
                University: "Calicut University",
            },
            {
                Regno : "EPALECS046",
                Grade : "A",
                Name: "Krishna T K",
                Subject: "CIVIL Engineering",
                Passout: "2019",
                Institution: "Focus Engineering College Thrissur",
                University: "Kerala Technical University",
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.Regno, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, regno,grade,name,subject,passout,institution,university) {
        const exists = await this.AssetExists(ctx, regno);
        if (exists) {
            throw new Error(`The asset ${regno} already exists`);
        }

        const asset = {
            Regno : regno,
            Grade : grade,
            Name: name,
            Subject: subject,
            Passout: passout,
            Institution: institution,
            University: university,
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(regno, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, regno) {
        const assetJSON = await ctx.stub.getState(regno); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, regno,grade,name,subject,passout,institution,university) {
        const exists = await this.AssetExists(ctx, regno);
        if (!exists) {
            throw new Error(`The asset ${regno} does not exist`);
        }

        // overwriting original asset with new asset
        const asset = {
            Regno : regno,
            Grade : grade,
            Name: name,
            Subject: subject,
            Passout: passout,
            Institution: institution,
            University: university,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(regno, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, regno) {
        const exists = await this.AssetExists(ctx, regno);
        if (!exists) {
            throw new Error(`The asset ${regno} does not exist`);
        }
        return ctx.stub.deleteState(regno);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, regno) {
        const assetJSON = await ctx.stub.getState(regno);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;