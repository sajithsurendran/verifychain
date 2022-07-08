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

    async Createsslc (ctx, regno,mob,name,marks,school,passout,board){
        const exists = await this.CertificateExists(ctx, regno);
        if (exists){
            throw new Error(`The certificate ${regno} already exists`);
        }

        const sslc ={
            Regno : regno,
            Mob: mob,
            Name : name,
            Marks : marks,
            School : school,
            Passout : passout,
            Board : board,
            DocType :"sslc"
        };
        await ctx.stub.putState(regno, Buffer.from(stringify(sortKeysRecursive(sslc))));
        return JSON.stringify(sslc);
    }
    async Createhse(ctx,regno,mob,name,marks,school,passout,board){
        const exists = await this.CertificateExists(ctx, regno);
        if(exists){
            throw new Error(`The asset ${regno} already exists`);
        }

        const hse = {
            Regno : regno,
            Mob: mob,
            Name : name,
            Marks : marks,
            School : school,
            Passout : passout,
            Board : board,
            DocType : "hse"
        };
        await ctx.stub.putState(regno, Buffer.from(stringify(sortKeysRecursive(hse))));
        return JSON.stringify(hse);
    }
    async Createug(ctx,regno,mob,name,marks,college,specialization,passout,university){
        const exists = await this.CertificateExists(ctx, regno);
        if (exists) {
            throw new Error(`The asset ${regno} already exists`);
        }

        const ug ={
            Regno : regno,
            Mob : mob,
            Name : name,
            Marks : marks,
            College : college,
            Specialization : specialization,
            Passout : passout,
            University : university,
            DocType : "ug",

        };

        await ctx.stub.putState(regno, Buffer.from(stringify(sortKeysRecursive(ug))))
        return JSON.stringify(ug)
    }
    
    async Createexp(ctx,empid,mob,name,company,start_date,end_date,designation,lpa){
        const exists = await this.CertificateExists(ctx, empid);
        if (exists){
            throw new Error(`The asset ${empid} already exists`);
        }
        const exp = {
            Empid: empid,
            Mob: mob,
            Name : name,
            Company : company,
            Start_date : start_date,
            End_date : end_date,
            Designation: designation,
            LPA : lpa,
            DocType : "exp",
        };
        await ctx.stub.putState(empid, Buffer.from(stringify(sortKeysRecursive(exp))));
        return JSON.stringify(exp);

    }

    async ReadCertificate (ctx, regno){
        const assetJSON = await ctx.stub.getState(regno); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${regno} does not exist`);
        }
        return assetJSON.toString();
    }

    async CertificateExists(ctx, regno) {
        const assetJSON = await ctx.stub.getState(regno);
        return assetJSON && assetJSON.length > 0;
    }

}

module.exports = AssetTransfer;
