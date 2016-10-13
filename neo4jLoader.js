const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase(`http://neo4j:cake@127.0.0.1:7474`);
const bluebird = require('bluebird');
const nomadData = require('./nomadData.json')

// Guide for how to weight each of the sections (e.g., safety, fun, etc)
const sectionWeighting = {
  'safety': 0.3,
  'fun': 0.3,
  'quality': 0.2,
  'ease': 0.2
}

// Calculate the weighting for each individual item (each section is equally weighted)
const weighting = {
  
  //safety
  'racism': sectionWeighting.safety / 7,
  'lgbt_friendly': sectionWeighting.safety / 7,
  'friendly_to_foreigners': sectionWeighting.safety / 7,
  'female_friendly': sectionWeighting.safety / 7,
  'peace_score': sectionWeighting.safety / 7,
  'press_freedom_index': sectionWeighting.safety / 7,
  'safety': sectionWeighting.safety / 7,

  // fun
  'nightlife': sectionWeighting.fun / 2,
  'weather': sectionWeighting.fun / 2,

  //quality
  'aircon': sectionWeighting.quality / 2,
  'life_score': sectionWeighting.quality / 2,

  //ease
  'download': sectionWeighting.ease / 5,
  'places_to_work': sectionWeighting.ease / 5,
  'free_wifi_available': sectionWeighting.ease / 5,
  'leisure': sectionWeighting.ease / 5,
  'nomad_score': sectionWeighting.ease / 5

}

// This function saves only one city
const saveCity = (cityObj) => (
  new Promise((resolve, reject) => {

    // Using the neo4j raw cypher querying language to save one city node
    let cityData = {
      'name': cityObj.info.city.name,

      'racism': cityObj.scores.racism,
      'lgbt_friendly': cityObj.scores.lgbt_friendly,
      'friendly_to_foreigners': cityObj.scores.friendly_to_foreigners,
      'female_friendly': cityObj.scores.female_friendly,
      'peace_score': cityObj.scores.peace_score,
      'press_freedom_index': cityObj.scores.press_freedom_index,
      'safety': cityObj.scores.safety,

      'nightlife': cityObj.scores.nightlife,
      'weather': 0,

      'aircon': cityObj.scores.aircon,
      'life_score': cityObj.scores.life_score,

      'download': cityObj.info.internet.speed.download,
      'places_to_work': cityObj.scores.places_to_work,
      'free_wifi_available': cityObj.scores.free_wifi_available,
      'leisure': cityObj.scores.leisure,
      'nomad_score': cityObj.scores.nomad_score
    }

    // Calculate the overall weighted score for the city node
    let weightedScore = 0;
    for (key in weighting) {
      weightedScore += weighting[key] * cityData[key];
    }

    // Cypher query to add one city node
    db.cypher({
      query: `MERGE (c:City {name: "${cityData.name}"}) \
      ON CREATE SET c.name = "${cityData.name}" \ 
        ON MATCH SET c.racism = "${cityData.racism}" \ 
        ON MATCH SET c.lgbt_friendly = "${cityData.lgbt_friendly}" \ 
        ON MATCH SET c.friendly_to_foreigners = "${cityData.friendly_to_foreigners}" \ 
        ON MATCH SET c.female_friendly = "${cityData.female_friendly}" \ 
        ON MATCH SET c.peace_score = "${cityData.peace_score}" \ 
        ON MATCH SET c.press_freedom_index = "${cityData.press_freedom_index}" \ 
        ON MATCH SET c.safety = "${cityData.safety}" \ 
        ON MATCH SET c.nightlife = "${cityData.nightlife}" \ 
        ON MATCH SET c.weather = "${cityData.weather}" \ 
        ON MATCH SET c.aircon = "${cityData.aircon}" \ 
        ON MATCH SET c.life_score = "${cityData.life_score}" \ 
        ON MATCH SET c.download = "${cityData.download}" \ 
        ON MATCH SET c.places_to_work = "${cityData.places_to_work}" \ 
        ON MATCH SET c.free_wifi_available = "${cityData.free_wifi_available}" \ 
        ON MATCH SET c.leisure = "${cityData.leisure}" \ 
        ON MATCH SET c.nomad_score = "${cityData.nomad_score}" \ 
      RETURN c;`,
    }, (err, newCity) => {
      if (err) {
        console.log(`error adding city: ${err}`);
        reject(err);
      } else {
      	console.log(`city added ${cityObj.info.city.name}`)
        resolve('next');
      }
    });
  })
);

const recursiveAdd = (cityArray) => {
	saveCity(cityArray[0])
	.then(function() {
		// Stop recursion when array is empty
    if (cityArray.length === 0) {
      return;
    // Recurse with the next city in the array (reducing the array on each recursive call)
    } else {
      recursiveAdd(cityArray.slice(1));
    }
  })
};

recursiveAdd(nomadData.result);
