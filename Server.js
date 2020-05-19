const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jchou21:AwesomeHusky751@cluster0-gr7o3.mongodb.net/test?retryWrites=true&w=majority"

let client;
let db;
let collection;


var fs = require('fs');
var express = require('express');

// using express
const app = express();
const port = 9000;
const path = require('path');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
app.use(express.urlencoded())

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

// using ejs to att to html document
app.set("view engine", "ejs")

// linking css to ejs file
app.use(express.static(__dirname + "/style"))

// variables sent to ejs file
let error = ""
let updateInfo = null
let deleteInfo = null
let updateOrInsert = ""

// setup for stuff
async function connect(){
	try {
		client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
    db = await client.db("CollegeRatings")
    collection = await db.collection("devices")
	}catch(err){
		console.error(err)
	}
}

async function insertOne(item, res){
	try {
		insertedYet = false
		const items = await collection.find().toArray()
		for(let school of items){
			if(school.name == item.name){
				error = "School already exists, use update info"
				console.log(error)
				res.redirect("back")
				return error
			}
		}
		const result = await collection.insertOne(item)
		res.redirect("back")
	} catch(err){
		res.redirect("back")
		console.error(err)
	}
}

async function update(name, info, res){
	try {
		const items = await collection.find().toArray()
		for(let item of items){
			console.log("item.name: " + item.name)
			console.log("name: " + name)
			if(item.name == name){
				await collection.updateOne(item, {'$set': info})
				updateOrInsert = "update"
				updateInfo = info
				res.redirect("back")
				return item
			}
		}
		if(name != ""){	
			updateOrInsert = "insert"
			collection.insertOne(info)
			updateInfo = info
			res.redirect("back")
		}
	} catch(err){
		res.redirect("back")
		console.error(err)
	}
}

async function deleteOne(name, res){
	try{
		const items = await collection.find().toArray()
		let deletedOne = false
		for(let item of items){
			if(item.name == name){
				await collection.deleteOne(item)
				deletedOne = true
				deleteInfo = item
			}
		}
		if(!deletedOne){
			error = "The name inputted was not already in the list. Inputted name: " + name
			deleteInfo = ""
		}
		res.redirect("back")
	} catch(err){
		res.redirect("back")
		console.error(err)
	}
}

async function showAll(){
  const items = await findAll()
  console.log(items)
}


// add or update information to dataset everything
async function addOrUpdate(name, rating){
	let college = {name: name, rating: rating}
	await update(college.name, college)
	showAll()
}

// remove information from dataset
async function remove(name){
  let college = {name: name}
  await deleteOne(college.name)
  showAll()
}

let insertedYet = false

// connect to the database
connect()

// sending information to the page
app.get("/", (req, res) => {
	if(db == undefined){
		connect()
	}else{
		db.collection('devices').find().toArray()
			.then(schools => {
				res.render('index.ejs', {schools: schools, error: error, insertedYet: insertedYet, updateInfo: updateInfo, deleteInfo: deleteInfo, updateOrInsert: updateOrInsert})
				
				// resetting variables
				insertedYet = false
				error = ""
				updateInfo = null
				deleteInfo = null
				updateOrInsert = ""
			})
	}
})

// add a document to the DB collection recording the click event
app.post("/insert", (req, res) => {
	var myData = req.body;
	console.log("mydata: " + myData);
	console.log("name: " + myData.name)
	console.log("rating: " + myData.rating)
	var object = {"name": myData.name, "rating": myData.rating}
	insertOne(object, res)
	console.log("inserted: " + object)
	insertedYet = true
})

app.post("/update", (req, res) => {
	var myData = req.body
	console.log("MyData: "+ myData)
	console.log("name: " + myData.name)
	console.log("rating: " + myData.rating)

	var object = {"name": myData.name, "rating": myData.rating}
	update(myData.name, object, res)
	console.log("updated: " + myData.name + ": " + myData.rating)

})

app.post("/delete", (req, res) => {
	var myName = req.body.name
	console.log("Deleting: " + myName + " from the list")
	deleteOne(myName, res)
	console.log("Deleted " + myName + " from the collection")
})
/*
next lesson, get html page to display feedback when submitting/updating

currently insertCode stalls the page when loading & updateCode stalls the page when loading in update
*/