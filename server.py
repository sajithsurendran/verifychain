
from cmath import e
from dataclasses import dataclass
from itertools import count
from os import stat
from pydoc import cli
import re
from this import d
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import requests
client = MongoClient('mongodb://localhost:27017/')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
    )

########## test api #################
class Check(BaseModel):
    regno : str
@app.post('/check')
async def check(check : Check):
    data =  requests.get('http://127.0.0.1:3000/verify',params={'regno':check.regno})
    return data.json()


########## user api #################

class User (BaseModel):
    name: str
    aadhaar : str
    mob : str
    pan: str
    password: str


@app.post('/useradd')
async def add_user(user : User):
    user = dict(user)
    client.verifychain.user.insert_one(user)
    return {"status": "success"}

class Validator (BaseModel):
    mob : str
    name: str
    password : str
    aadhaar : str


@app.post('/validateradd')
async def validateradd(validator : Validator):
    client.verifychain.validator.insert_one(dict(validator))
    return {"status": "success"}

'''@app.post('/useredit')
async def useredit(user : User):
    client.verifychain.user.find_one_and_update({"mob":user.mob},)'''
#### user delete api  #################

@app.post('/userdelete')
async def userdelete(mob:str):
    client.verifychain.user.find_one_and_delete({"mob":mob})

##### add university api ####################3

class University (BaseModel):
    name: str
    mob: str
    password :str
    country: str
@app.post('/universityadd')
async def add_university(university : University):
    university = dict(university)
    client.verifychain.university.insert_one(university)
    return {"status": "success"}

####### delete university api ###
@app.post('/universitydelete')
async def remove_university(name : str):
    client.verifychain.university.find_one_and_delete({"name":name})


class Company (BaseModel):
    mob: str
    uin : str
    companyname: str
    password : str

@app.post('/companyadd')
async def add_company(company: Company):
    client.verifychain.company.insert_one(dict(company))
    return {"status": "success"}

@app.post('/companydelete')
async def remove_company(company: Company):
    client.verifychain.company.find_one_and_delete({"mob":company.mob})

############3 login api #############333

class Login (BaseModel):
    mob: str
    password : str

@app.post('/loginuser')
async def loginuser(login : Login):
    status=""
    user = ""
    filter={
        'mob': login.mob, 
        'password': login.password
    }

    result = client['verifychain']['user'].find(filter=filter)
    if len(list(result)) == 0: 
        result = client.verifychain.validator.find(filter=filter)
        if len(list(result)) == 0: 
            result = client.verifychain.university.find(filter=filter)
            if len(list(result)) == 0: 
                result = client.verifychain.company.find(filter=filter)
                if len(list(result)) == 0:
                    status =0
                    user = "User not found"
                else:
                    user = "company"
                    status =1
            else: 
                user = "university"
                status= 1
        else: 
            user = "validator"
            status= 1
    else: 
        user = "user"
        status= 1
                
    return {"status": status,"usertype":user }



class SSLC (BaseModel):
   
    regno : str
    mob : str
    name : str
    marks : str
    school : str
    passout : str
    board : str

@app.post('/addsslccerti')
async def addsslccerti(sslc : SSLC):
    sslc = dict(sslc)
    #res = requests.post('http://127.0.0.1:3000/sslc',json=sslc)
    #print (res.json())
    sslc['status'] = "verification pending"
    client.verifychain.sslc.insert_one(sslc)
    return {"status": "success"}

### hse certificates inserting to the database and blockchain ######################33
class HSE(BaseModel):
    regno : str
    mob : str
    name : str
    marks : str
    school : str
    passout : str
    board : str
@app.post('/addhsecerti')
async def addhsecerti(hse : HSE):
    hse = dict(hse)
    hse['status'] = "verification pending"
    client.verifychain.hse.insert_one(hse)
    return {"status": "success"}

################ inserting ug certificate in to the database ##########

class UG (BaseModel):
    regno : str
    mob : str
    name : str
    marks : str
    college : str
    specialization : str
    passout : str
    university : str

@app.post('/addugcerti')
async def addugcerti( ug : UG):
    ug = dict(ug)
    ug['status'] = "verification pending"
    client.verifychain.ug.insert_one(ug)
    return {"status": "success"}

################# inserting pg certificate in to the database  and blockchain ##########

class PG (BaseModel):
    regno : str
    mob : str
    name : str
    marks : str
    college : str
    specialization : str
    passout : str
    university : str
@app.post('/addpgcerti')
async def addpgcerti(pg : PG):
    pg = dict(pg)
    pg['status'] = "verification pending"
    client.verifychain.pg.insert_one(pg)
    return {"status": "success"}


class Exp(BaseModel):
    empid :str
    mob : str
    name : str
    company : str
    start_date : str
    end_date : str
    designation : str
    lpa : str

@app.post('/addexp')
async def addexp(exp : Exp ):
    exp = dict(exp)
    exp['status'] = "verification pending"
    client.verifychain.experience.insert_one(exp)
    return {"status": "success"} 



class Vsslc(BaseModel):
    regno : str
@app.post('/verifysslc')
async def verifysslc(sslc : Vsslc):
    client.verifychain.sslc.find_one_and_update({'regno': sslc.regno},{"$set":{'status': "verified"}})
    result = dict(client.verifychain.sslc.find_one({'regno': sslc.regno},{'_id':0,'status':0}))
    res = requests.post('http://127.0.0.1:3000/sslc',json=result)
    return {"status": "verified"}



class Vhse (BaseModel):
    regno : str
@app.post('/verifyhse')
async def verifyhse(hse : Vhse):
    client.verifychain.hse.find_one_and_update({'regno': hse.regno},{"$set": {"status": "verified"}})
    result = dict(client.verifychain.hse.find_one({'regno': hse.regno},{'_id':0,'status':0}))
    res = requests.post('http://127.0.0.1:3000/hse',json =result)
    return {"status": "verified"}


class Vug (BaseModel):
    regno : str
@app.post('/verifyug')
async def verifyug(ug :Vug):
    client.verifychain.ug.find_one_and_update({'regno': ug.regno},{"$set": {"status": "verified"}})
    result = dict(client.verifychain.ug.find_one({'regno': ug.regno},{'_id':0,'status':0}))
    res = requests.post('http://127.0.0.1:3000/ug',json =result)
    return {"status": "verified"}


class Vpg (BaseModel):
    regno : str
@app.post('/verifypg')
async def verifypg(pg :Vpg): 
    client.verifychain.pg.find_one_and_update({'regno': pg.regno},{"$set": {"status": "verified"}})
    result = dict(client.verifychain.pg.find_one({'regno': pg.regno},{'_id':0,'status':0}))
    res = requests.post('http://127.0.0.1:3000/pg',json =result)
    return {"status": "verified"}


class Vexp (BaseModel):
    empid : str
@app.post('/verifyexp')
async def verifyexp(exp : Vexp):
    client['verifychain']['experience'].find_one_and_update({'empid': exp.empid},{"$set": {"status": "verified"}})
    result = dict(client.verifychain.experience.find_one({'empid': exp.empid},{'_id':0,'status':0}))
    res = requests.post('http://127.0.0.1:3000/exp',json =result)
    return {"status": "verified"}


class FectchP(BaseModel):
    mob : str
@app.post('/fetchprofile')
async def fetchprofile(p : FectchP):
    result = []
    data =  dict(client.verifychain.sslc.find_one({'mob': p.mob},{'_id':0}))
    result.append(data)
    data = dict(client.verifychain.hse.find_one({'mob': p.mob},{'_id':0}))
    result.append(data)
    data = dict(client.verifychain.ug.find_one({'mob': p.mob},{'_id':0}))
    result.append(data)
    data = dict(client.verifychain.pg.find_one({'mob': p.mob},{'_id':0}))
    result.append(data)
    for i in list(client.verifychain.experience.find({"mob": p.mob},{'_id':0})):
        result.append(i)
    return result



class Udata (BaseModel):
    mob : str
    regno : str
    key : str
    value : str

@app.post('/updatesslcstatus')
async def updatesslcstatus( u :Udata):
    client.verifychain.sslc.find_one_and_update({'regno':u.regno},{"$set": {u.key: u.value}})
    return {"status": "success"}

class Rdata (BaseModel):
    mob : str
@app.post('/rdatasslc')
async def rdatasslc( u :Rdata):
    data=list(client.verifychain.sslc.find({'mob':u.mob},{'_id':0}))
    return data

@app.post('/rdatahse')
async def rdatahse(u :Rdata):
    data = list(client.verifychain.hse.find({'mob': u.mob},{'_id':0}))
    return data

@app.post('/rdataug')
async def rdataug(u :Rdata):
    data = list(client.verifychain.ug.find({'mob': u.mob},{'_id':0}))
    return data

@app.post('/rdatapg')
async def rdatapg( u :Rdata):
    data = list(client.verifychain.pg.find({'mob': u.mob},{'_id':0}))
    return data

@app.post('/rdataexp')
async def rdataexp( u:Rdata):
    data = list(client.verifychain.experience.find({'mob':u.mob},{'_id':0}))
    return data

@app.post('/fetchuser')
async def fetchuser( u:Rdata):
    data = dict(client.verifychain.user.find_one({'mob':u.mob},{'_id':0,'password':0}))
    return data

@app.get('/fetchnvsslc')
async def fetchnv( ):
    
    count = client.verifychain.sslc.count_documents({'status':'verification pending'})
    if count==0:
        return {"status": 0}
    else :
        data=dict(client.verifychain.sslc.find_one({'status':'verification pending'},{"_id":0,'status':0}))
        return {"status": 1,"doc": data}

@app.get('/fetchnvhse')
async def fetchnvhse():
    count = client.verifychain.hse.count_documents({'status':'verification pending'})
    if count == 0: 
        return {"status": 0}
    else :
        data = dict(client.verifychain.hse.find_one({'status':'verification pending'},{'_id':0,'status':0}))
        return {"status": 1,"doc": data}

@app.get('/fetchnvug')
async def fetchnvug():
    count = client.verifychain.ug.count_documents({'status':'verification pending'})
    if count == 0:
        return {"status": 0}
    else :
        data = dict(client.verifychain.ug.find_one({'status':'verification pending'},{'_id':0,'status':0}))
        return {"status": 1,"doc": data}

@app.get('/fetchnvpg')
async def fetchnvpg():
    count = client.verifychain.pg.count_documents({'status':'verification pending'})
    if count == 0:
        return {"status": 0}
    else :
        data = dict(client.verifychain.pg.find_one({'status':'verification pending'},{'_id':0,'status':0}))
        return {"status": 1,"doc": data}

@app.get('/fetchnvexp')
async def fetchnvexp():
    count = client.verifychain.experience.count_documents({'status':'verification pending'})
    if count == 0:
        return {"status": 0}
    else :
        data = dict(client.verifychain.experience.find_one({'status':'verification pending'},{'_id':0,'status':0}))
        return {"status": 1,"doc": data}
