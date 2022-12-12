
import Axios from "axios";
import { DH } from "will-dh";

async function testDiffie() {
	let url = "http://localhost:8080/ria/crypto/dh_c.jsp";
	let enc_url = "http://localhost:8080/ria/crypto/dh_enc_c.jsp";
	let dec_url = "http://localhost:8080/ria/crypto/dh_dec_c.jsp";

    let dh = new DH();
    await dh.init();

    const inst: any = Axios.create();

	const data = await inst.post(url).then(
        (res:any) => {
            const cookie = res.headers["set-cookie"];
            inst.defaults.headers.Cookie = cookie;
            return res.data
        }
	);

	console.log("data",JSON.stringify(data));	
    if(data.body.info) {
        let info = data.body.info;
        dh.prime = info.prime;
        dh.generator = info.generator;
        dh.otherPublicKey = info.publickey;
        dh.compute();
        console.log("dh",dh);

        let params = new URLSearchParams({publickey: dh.publicKey});
        await inst.post(url,params);

        let msg = "Hello from node";
        let encmsg = dh.encrypt(msg);

        params = new URLSearchParams({plaintext: msg});
        const enc_data = await inst.post(enc_url,params).then(
            (res:any) => res.data
        );	
        console.log("enc_data",enc_data);
        let cipher_data = enc_data.body.ciphertext;
        let raw_data = dh.decrypt(cipher_data);
        console.log("raw data",raw_data);

        params = new URLSearchParams({ciphertext: encmsg});        
        const dec_data = await inst.post(dec_url,params).then(
            (res:any) => res.data
        );	
        console.log("dec_data",dec_data);
        let cipher_text = dec_data.body.ciphertext;
        let raw_text = dh.decrypt(cipher_text);
        console.log("raw data",raw_text);

    }

}
testDiffie();
