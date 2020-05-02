'use strict'

const createCert = require('create-cert')
const {
	createServer: createGeminiServer,
	DEFAULT_PORT,
} = require('..')

const onRequest = (req, res) => {
	if (req.path === '/foo') {
		res.write('foo')
		res.end('!')
	} else if (req.path === '/bar') {
		res.redirect('/foo')
	} else {
		res.gone()
	}
}

const onError = (err) => {
	console.error(err)
	process.exit(1)
}

createCert('example.org')
.then((keys) => {
	const server = createGeminiServer({
		tlsOpt: keys,
		// todo: SNICallback
	}, onRequest)
	server.on('error', onError)

	server.listen(DEFAULT_PORT, (err) => {
		if (err) return onError(err)
		const {address, port} = server.address()
		console.info(`listening on ${address}:${port}`)
	})
})
.catch(onError)
