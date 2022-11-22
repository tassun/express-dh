import { DH } from "will-dh";
import { Request, Response } from 'express';
import express from 'express';
import bodyparser from 'body-parser';
const urlencodedparser = bodyparser.urlencoded({ extended: false })
const router = express.Router();

router.post('/dh', urlencodedparser, async function(req: Request, res: Response) {
    console.log("body",req.body);
	let session : any = req.session;
    let dh = new DH();
    if(session.diffie) {
        let diffie = session.diffie as DH;        
        dh.prime = diffie.prime;
        dh.generator = diffie.generator;
        dh.privateKey = diffie.privateKey;
        dh.publicKey = diffie.publicKey;
        dh.sharedKey = diffie.sharedKey;
        dh.otherPublicKey = diffie.otherPublicKey;
    } else {
        await dh.init();
    }
    let publickey = req.body.publickey;
    if(publickey) {
        dh.otherPublicKey = publickey;
        dh.computeSharedKey();
    }
    session.diffie = dh;
    console.log("dh",dh);
    let response = {
        body : { 
            info: {
                prime: dh.prime, 
                generator: dh.generator,
                publickey: dh.publicKey,
            }
        }
    };
	console.log("response",response);
	res.send(JSON.stringify(response));
});

router.post('/dh/encrypt', urlencodedparser, async function(req: Request, res: Response) {
    console.log("body",req.body);
    let plaintext = req.body.plaintext;
    let session: any = req.session;
    let dh = new DH();
    let diffie = session.diffie as DH;        
    dh.prime = diffie.prime;
    dh.generator = diffie.generator;
    dh.privateKey = diffie.privateKey;
    dh.publicKey = diffie.publicKey;
    dh.sharedKey = diffie.sharedKey;
    dh.otherPublicKey = diffie.otherPublicKey;
    let body: any = { };    
    if(dh && plaintext) {
        body.plaintext = plaintext;
        let enctext = dh.encrypt(plaintext);
        console.log("encrypt text",enctext);
        body.ciphertext = enctext;
    }
	let response = { body: body };
	console.log("response",response);
	res.send(JSON.stringify(response));
});

router.post('/dh/decrypt', urlencodedparser, async function(req: Request, res: Response) {
    console.log("body",req.body);
    let ciphertext = req.body.ciphertext;
    let session: any = req.session;
    let dh = new DH();
    let diffie = session.diffie as DH;        
    dh.prime = diffie.prime;
    dh.generator = diffie.generator;
    dh.privateKey = diffie.privateKey;
    dh.publicKey = diffie.publicKey;
    dh.sharedKey = diffie.sharedKey;
    dh.otherPublicKey = diffie.otherPublicKey;
    let body: any = { };    
    if(dh && ciphertext) {
        body.ciphertext = ciphertext;
        let dectext = dh.decrypt(ciphertext);
        console.log("decrypt text",dectext);
        body.plaintext = dectext;
    }
	let response = { body: body };
	console.log("response",response);
	res.send(JSON.stringify(response));
});

export default router;
