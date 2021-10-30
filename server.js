const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = 5000;

//bd-travel
//4CsrMCGYZJhgYMZe

// middileware
app.use(cors());
app.use(express.json());

const uri =
	'mongodb+srv://bd-travel:4CsrMCGYZJhgYMZe@cluster0.ireya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
	try {
		await client.connect();
		const database = client.db('tourismSelect');
		const tourismCollection = database.collection('tourismCollection');
		const newBookingCollection = database.collection('newBooking');
		app.post('/user', async (req, res) => {
			const user = req.body;
			const result = await tourismCollection.insertOne(user);

			// console.log('hitting the post', user);
			res.json(result);
		});
		app.get('/user', async (req, res) => {
			const getUser = tourismCollection.find({});
			const cursor = await getUser.toArray();
			// console.log(cursor);
			res.json(cursor);
		});

		// lod dynamic id get method
		app.get('/user/:id', async (req, res) => {
			const tourId = req.params.id;
			const query = { _id: ObjectId(tourId) };
			const tour = await tourismCollection.findOne(query);
			// console.log(tour);
			res.json(tour);
		});

		/// send spacific boking post api
		app.post('/user/newBooking', async (req, res) => {
			const newBooked = req.body;
			const currentBooked = [
				...tourismCollection,
				newBooked
			];
			const result = await newBookingCollection.insertOne(currentBooked);
			console.log(result);
			res.send(result);
		});
		// send data ui get api
		app.get('/user/newBooking', async (req, res) => {
			const cursor = newBookingCollection.find({});
			const result = await cursor.toArray();
			// console.log(result);
			res.json(result);
		});
	} finally {
		//   await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	console.log('start server');
	res.send('server is running ');
});

app.listen(port, () => {
	console.log('runing server', port);
});
