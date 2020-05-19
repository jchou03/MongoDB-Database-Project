const mongo = require("mongodb").MongoClient
const url = "mongodb+srv://deanna:dcoder@cluster0-nc7re.mongodb.net/test?retryWrites=true&w=majority"

let client;
let db;
let collection;

async function connect(){
	try {
		const client = await mongo.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		return client
	}catch(err){
		console.error(err)
	}
}

async function findAll(){
	try {
		const items = await collection.find().toArray()
		return items
	} catch(err){
		console.error(err)
	}
}

async function findOne(name){
	try {
		const items = await findAll()
		for(let item of items){
			if(item.name == name){
				return item
			}
		}
		return null
	} catch(err) {
		console.error(err)
	}
}

async function insertMany(items){
	try {
		const results = await collection.insertMany(items)
	} catch(err) {
		console.error(err)
	}
}

async function insertOne(item){
	try {
		const result = await collection.insertOne(item)
	} catch(err){
		console.error(err)
	}
}

async function update(name, info){
	try {
		const items = await findAll()
		for(let item of items){
			if(item.name == name){
				await collection.updateOne(item, {'$set': info})
			}
		}
	} catch(err){
		console.error(err)
	}
}

async function deleteOne(name){
	try{
		const items = await findAll()
		for(let item of items){
			if(item.name == name){
				await collection.deleteOne(item)
			}
		}
	} catch(err){
		console.error(err)
	}
}

async function run(){
	client = await connect()
 	db = await client.db("collegeRating")
 	collection	= await db.collection("colleges")
	let uci = {name: "UCI", rating: 5}
	await update(uci.name, uci)
	const items = await findAll()
	console.log(items)
	client.close()
}

run()
	

	

