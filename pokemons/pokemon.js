const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const DB_URL = 'mongodb+srv://59161190:mart0877@cluster0-xauad.gcp.mongodb.net/admin?retryWrites=true&w=majority'
const DB_NAME = 'example'
const options = { useNewUrlParser:true ,  useUnifiedTopology: true  }
var client 
let pokemons = []
var collection,database
mockPokemon()

function Pokemon(name, type) {
    this.name = name
    this.type = type
    this.id = null
    this.type2 = null
}

async function connectDatabase(){
    if(client !== undefined && client !== null && client.isConnected){
        return client
    }
    client = await mongoClient.connect(DB_URL , options).catch(err => console.log(err))
    return client
}
async function getCollection(name){
    client = await connectDatabase().catch(err=> console.error(err))
    database = client.db(DB_NAME)
    collection = database.collection(name)
    return collection
}



async function getPokemons(){
   var collection = await getCollection('pokemons')
    try{
        var result = await  collection.find({}).toArray()
        return result
    }catch(err){
        console.err(err)
        return false
    }finally{
        client.close()
    }
}

async function savePokemon(name, type) {
    let p = createPokemon(name, type)
    // callback function --> m.connect(url, options, callback_fn)
    // var client = await mongoClient.connect(DB_URL , options) // จะรอจนว่า mongoClient.connect(DB_URL , options) ทำเสด
    var collection = await getCollection('pokemons')
    try{
        var result = await collection.insert(p)
        return true 
    }catch(err){
        console.err(err)
        return false
    }finally{
        client.close()
    }
    // mongoClient.connect(DB_URL,{ useNewUrlParser:true ,  useUnifiedTopology: true  },(error,client)=>{
    //     if(error){
    //         return false
    //     }
    //     database = client.db(DB_NAME)

    //     collection = database.collection('pokemons')
    //     collection.insert(p,(err,result)=>{
    //         if(err){
    //             return false
    //         }
    //         return true
    //     })
    // })
}

function createPokemon(name, type) {
    let p = new Pokemon(name, type)
    p.id = generateNewId(pokemons.length)
    return p
}

function mockPokemon() {
    pokemons.push(createPokemon('Pikachu', 'Electric'))
    pokemons.push(createPokemon('Paras', 'Bug'))
}

function generateNewId(num) {
    return num + 1
}

function isPokemonExisted(id) {
    return pokemons[id-1] !== undefined && pokemons[id-1] !== null
}

async function getPokemon(id) {
    var collection = await getCollection('pokemons')
     try{
        var result = await  collection.findOne({ _id : ObjectID(id)})
        return result
     }catch(err){
         console.err(err)
         return err

     }finally{
        client.close()
     }
}

async function update(id,type) {
    var collection = await getCollection('pokemons')
     try{
        var result = await collection.updateOne({_id : ObjectID(id)},{$set:{type2:type}})
        return result
     }catch(err){
         console.err(err)
         return err

     }finally{
        client.close()
     }
     
}

module.exports.isPokemonExisted = isPokemonExisted
module.exports.savePokemon = savePokemon
module.exports.getPokemon = getPokemon
module.exports.update = update
module.exports.getPokemons = getPokemons