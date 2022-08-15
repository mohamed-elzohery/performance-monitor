//See https://github.com/elad/node-cluster-socket.io

import express from 'express';
import cluster, { Worker } from 'cluster';
import net from 'net';
import socketio, { Server, Socket, } from 'socket.io';
// const helmet = require('helmet')
import socketMain from './socketMain';
// const expressMain = require('./expressMain');

const port = 8181;
const num_processes = require('os').cpus().length;

import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import farmhash from 'farmhash';

if (cluster.isPrimary) {
	
	let workers: Worker[] = [];

	let spawn = function(i: number) {
		workers[i] = cluster.fork();

		// Optional: Restart worker on exit
		workers[i].on('exit', function(code, signal) {
			spawn(i);
		});
    };

    // Spawn workers.
	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}

	// Helper function for getting a worker index based on IP address.
	// This is a hot path so it should be really fast. The way it works
	// is by converting the IP address to a number by removing non numeric
    // characters, then compressing it to the number of slots we have.
	//
	// Compared against "real" hashing (from the sticky-session code) and
	// "real" IP number conversion, this function is on par in terms of
	// worker index distribution only much faster.
	const worker_index = function(ip: string, len: number) {
		return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
	};


    // in this case, we are going to start up a tcp connection via the net
    // module INSTEAD OF the http module. Express will use http, but we need
    // an independent tcp port open for cluster to work. This is the port that 
    // will face the internet
	const server = net.createServer({ pauseOnConnect: true }, (connection) =>{
		// We received a connection and need to pass it to the appropriate
		// worker. Get the worker for this connection's source IP and pass
		// it the connection.

		let worker = workers[worker_index(connection.remoteAddress!, num_processes)];
		worker.send('sticky-session:connection', connection);
    });
    server.listen(port);
    console.log(`Master listening on port ${port}`);
} else {
    // Note we don't use a port here because the master listens on it for us.
    let app = express();
    // app.use(express.static(__dirname + '/public'));
    // app.use(helmet());
    
	// Don't expose our internal server to the outside world.
    const server = app.listen(0, 'localhost');
    // console.log("Worker listening...");    
    const io = new Server();
    const pubClient = createClient({socket: { host: 'localhost', port: 6379 }});
    const subClient = pubClient.duplicate();

	// Tell Socket.IO to use the redis adapter. By default, the redis
	// server is assumed to be on localhost:6379. You don't have to
	// specify them explicitly unless you want to change them.
	// redis-cli monitor
	Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
      }).catch(console.log);

    // Here you might use Socket.IO middleware for authorization etc.
	// on connection, send the socket over to our module with socket stuff
    io.on('connection', function(socket: Socket) {
		socketMain(io,socket);
		console.log(cluster.worker?.id)
		console.log("client connected")
		// console.log(`connected to worker: ${cluster.worker.id}`);
    });

		// console.log(`connected to worker: ${cluster.worker.id}`);


	// Listen to messages sent from the master. Ignore everything else.
	process.on('message', function(message, connection: net.Socket) {
		if (message !== 'sticky-session:connection') {
			return;
		}

		// Emulate a connection event on the server by emitting the
		// event with the connection the master sent us.
		server.emit('connection', connection);

		connection.resume();
	});
}


