const getPrimes = function (min, max) {
	   const result = Array(max + 1).fill(0).map((_, i) => i);
	   for (let i = 2; i <= Math.sqrt(max + 1); i++) {
	      for (let j = i ** 2; j < max + 1; j += i) delete result[j];
	   }
	   return Object.values(result.slice(min));
};
	
const getRandomNum = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
	
const getRandomPrime =function (min, max) {
	const primes = getPrimes(min, max);
	return primes[getRandomNum(0, primes.length - 1)];
};
	
const getPrimeNumber = function() {
	return getRandomPrime(1000,10000);
};
	
function DH() {
	this.prime = ""+getPrimeNumber();
	this.generator = ""+getPrimeNumber();
	this.privateKey = ""+getPrimeNumber();
	this.publicKey = ""+getPrimeNumber();
	this.sharedKey = ""+getPrimeNumber();
	this.otherPublicKey = ""+getPrimeNumber();
}

DH.prototype.encryptText = function(word,keyBase64) {
		var key = CryptoJS.enc.Base64.parse(keyBase64);
	    var srcs = CryptoJS.enc.Utf8.parse(word);
	    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	    return encrypted.toString();
	};

DH.prototype.decryptText = function(word,keyBase64) {
	    var key = CryptoJS.enc.Base64.parse(keyBase64);
	    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	};

DH.prototype.encrypt = function(word) {
		let hash = CryptoJS.SHA256(this.sharedKey);
		var keyBase64 = hash.toString(CryptoJS.enc.Base64);
		var key = CryptoJS.enc.Base64.parse(keyBase64);
	    var srcs = CryptoJS.enc.Utf8.parse(word);
	    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	    return encrypted.toString();
	};

DH.prototype.decrypt = function(word) {
		let hash = CryptoJS.SHA256(this.sharedKey);
		var keyBase64 = hash.toString(CryptoJS.enc.Base64);
	    var key = CryptoJS.enc.Base64.parse(keyBase64);
	    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	};
	
DH.prototype.computePublicKey = function() {	
		var G = new BigInteger(this.generator);
		var P = new BigInteger(this.prime);
		var a = new BigInteger(this.privateKey);
		var ap = G.modPowInt(a, P);
		this.publicKey = ap.toString();
	};

DH.prototype.computeSharedKey = function() {
		var P = new BigInteger(this.prime);
		var a = new BigInteger(this.privateKey);
		var bp = new BigInteger(this.otherPublicKey);		
		var ashare = bp.modPowInt(a, P);
		this.sharedKey = ashare.toString();
	};
	
DH.prototype.compute = function() {
		this.computePublicKey();
		this.computeSharedKey();
	};
	
DH.prototype.requestGenerator = function(callback,aurl) {
		this.requestPublicKey(this,callback,aurl);
	};

DH.prototype.requestPublicKey = function(dh,callback,aurl) {
		if(!aurl) aurl = "/crypto/dh";
		jQuery.ajax({
			url: aurl,
			type: "POST",
			dataType: "json",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			error : function(transport,status,errorThrown) {
				console.log(errorThrown);
				if(callback) callback(false,errorThrown);
			},
			success: function(data,status,transport){
				console.log(transport.responseText);
				if(dh && data.body.info) {
					let info = data.body.info;
					dh.prime = info.prime;
					dh.generator = info.generator;
					dh.otherPublicKey = info.publickey;
					dh.compute();
					dh.submitPublicKey();
				}	
				if(callback) callback(true,data,transport);
			}
		});	
	};
	
DH.prototype.submitPublicKey = function(callback,aurl) {
		if(!aurl) aurl = "/crypto/dh";
		jQuery.ajax({
			url: aurl,
			type: "POST",
			data: {
				fsAjax: "true",
				publickey: this.publicKey
			},
			dataType: "json",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			error : function(transport,status,errorThrown) {
				console.log(errorThrown);
				if(callback) callback(false,errorThrown);
			},
			success: function(data,status,transport){
				console.log(transport.responseText);
				if(callback) callback(true,transport);
			}
		});		
	};

