import express from 'express';
const router = express.Router();

router.get('/',(req, res) => {
	let sess : any = req.session;
	if(sess.email) {
		return res.redirect('/admin');
	}
	res.sendFile('index.html');
});

router.post('/login',(req, res) => {
	let sess : any = req.session;
	sess.email = req.body.email;
	res.end('done');
});

router.get('/admin',(req, res) => {
	let sess : any = req.session;
	res.contentType('text/html');
	console.log("session",sess);
	if(sess.email) {
		res.write(`<h2>Hello ${sess.email}</h2>`);
		res.write(`<h2>Session ID ${sess.id}</h2><br/>`);
		res.end('<a href="/logout">Logout</a>');
	} else {
		res.write('Please login first.<br/>');
		res.end('<a href="/">Login');
	}
});

router.get('/logout',(req, res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
	});

});

export default router;
