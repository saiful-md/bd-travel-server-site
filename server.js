const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//bd-travel
//4CsrMCGYZJhgYMZe

// middileware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env
	.USER_PASS}@cluster0.ireya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
	try {
		await client.connect();
		const database = client.db('tourismSelect');
		const tourismCollection = database.collection('tourismCollection');
		const newBookingCollection = database.collection('newBooking');

		//add a new tour spot: POST API
		app.post('/allTickets', async (req, res) => {
			const newSpot = req.body;
			// newSopt.id = tourismCollection.length;
			const result = await tourismCollection.insertOne(newSpot);

			// console.log('hitting the post', result);
			res.json(result);
		});

		// get all service data from server
		app.get('/allTickets', async (req, res) => {
			const getUser = tourismCollection.find({});
			const cursor = await getUser.toArray();
			// console.log(cursor);
			res.json(cursor);
		});

		// load dynamic service data with id: GET API go
		app.get('/allTickets/:id', async (req, res) => {
			const tourId = req.params.id;
			const query = { _id: ObjectId(tourId) };
			const tour = await tourismCollection.findOne(query);
			// console.log(tour);
			res.json(tour);
		});

		// send spacific user to database
		app.post('/spacificUser', async (req, res) => {
			const spacificUserItem = req.body;
			spacificUserItem.status = 'pending';
			const result = await newBookingCollection.insertOne(spacificUserItem);
			// console.log('hit the server', result);
			res.json(result);
		});

		app.get('/spacificUSer', async (req, res) => {
			const cursor = newBookingCollection.find({});
			const query = await cursor.toArray();
			// console.log(query);
			res.json(query);
		});

		// delete spacific user from ui
		app.delete('/spacificUser/:id', async (req, res) => {
			const deleteId = req.params.id;
			console.log(deleteId);
			const query = { _id: ObjectId(deleteId) };
			const tour = await newBookingCollection.deleteOne(query);
			// console.log(tour, 'delete')
			res.json(tour);
		});
	} finally {
		//   await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	// console.log('start server');
	res.send('server is running ');
});

app.listen(port, () => {
	console.log('runing server', port);
});
