const express = require('express');
//const ApiGatewayUrl = "https://op8j2i1i4l.execute-api.eu-west-3.amazonaws.com/dev";
const axios = require('axios');
const router = express.Router();
const {"v4": uuidv4} = require('uuid');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const instance = axios.create({
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    }
});
/**
 * Méthode pour récupérer la liste des des jeux pour une console à la lettre choisie
 * @returns {Array} retourne un tableau de games
 */
router.get('/games/:consoleName/:letter', async(req, res) => {
    console.log("Get games list...");
    try {
       const collection = await loadGamesCollection();
       const data = await collection.find({consoleName:req.params.consoleName}).toArray(); // Todo: regex pour filtrer sur la première lettre du nom
       res.send(data);
    } catch (error) {
        console.log("Erreur lors de la récupération de la liste des jeux; "+req.params.userId+"\n", error);
    }
});

/**
 * Récupération des données d'un jeu
 * @returns {object} retourne les données du jeu
 */
router.get('/game/:id', async(req, res) => {
    console.log("Get meeting...");
    try {
        var response={};
        const collection = await loadGamesCollection();
        const data = await collection.findOne({_id:new ObjectID(req.params.id)})
        // Si on a pas awsMeetingId c'est que la ressource n'existe pas encore
            response = await createChimeMeeting(data.ExternalMeetingId, data.userId);
            res.status("200").send(response);
    } catch (error) {
        console.log("Erreur lors de la récupération des données du meeting : \n", error);
    }
});


/**
 * /!\ Plus utilisé, gardé juste pour avoir un exemple d'appel
 * Récupération des resources attendee et meeting 
 * @returns {Object} retourne les objets meeting et attendee si les resources sont disponibles
 * ou si les resource ne sont pas disponible 
 */
/*
async function getAwsResources(awsMeetingId, userId){
    console.log("getAwsResources...")
    var awsResponse = await instance({ 
        url:"https://op8j2i1i4l.execute-api.eu-west-3.amazonaws.com/dev/meetings/"+awsMeetingId+"/attendees/"+userId, 
        method:"get"
    });
    var response = awsResponse.data;
    console.log(response);
    return response      
}
*/

/**
 * Ajout d'une nouvelle console dans la BDD
 */
router.post('/game', async(req, res) => {
    // Création des paramètres pour aws
    console.log("Adding a new game");
    const consoleId = new ObjectID();
    // Ajout d'une nouvelle entrée dans la bdd
    try{
        const collection = await loadGamesCollection();
        //Pour chaque attendee faire une entré e dans la bdd
        //for(attendeeIndex in req.body.attendees){
            await collection.insertOne({
                title: req.body.title,
                console: req.body.console,
                outdate: req.body.outdate,
                description:req.body.description,
                img:req.body.img, // Array d'url d'images
                rate:req.body.rate,
                feedback:req.body.feedback
            });
        //}
    }catch(error){
        console.log("erreur lors de la création du nouveau jeu \n ", error);
    }
    res.status("200");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify("Done"));
});
  
/**
  Récupération des données sauvegardé dans la bdd
 */
  async function loadGamesCollection() {
    const client = await MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    return client.db('ludotheque').collection('games');
  }
  
module.exports = router;
