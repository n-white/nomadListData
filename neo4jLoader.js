const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase(`http://neo4j:cake@127.0.0.1:7474`);
const bluebird = require('bluebird');
const nomadData = require('./nomadData.json')

        // ON MATCH SET c.${racism} = ${racism} \ 
        // ON MATCH SET c.${lgbt_friendly} = ${lgbt_friendly} \ 
        // ON MATCH SET c.${friendly_to_foreigners} = ${friendly_to_foreigners} \ 
        // ON MATCH SET c.${female_friendly} = ${female_friendly} \ 
        // ON MATCH SET c.${peace_score} = ${peace_score} \ 
        // ON MATCH SET c.${press_freedom_index} = ${press_freedom_index} \ 
        // ON MATCH SET c.${safety} = ${safety} \ 
        // ON MATCH SET c.${nightlife} = ${nightlife} \ 
        // ON MATCH SET c.${weather} = ${weather} \ 
        // ON MATCH SET c.${aircon} = ${aircon} \ 
        // ON MATCH SET c.${life_score} = ${life_score} \ 
        // ON MATCH SET c.${download} = ${download} \ 
        // ON MATCH SET c.${places_to_work} = ${places_to_work} \ 
        // ON MATCH SET c.${free_wifi_available} = ${free_wifi_available} \ 
        // ON MATCH SET c.${leisure} = ${leisure} \ 
        // ON MATCH SET c.${nomad_score} = ${nomad_score} \ 


const sectionWeighting = {
  'safety': 0.3,
  'fun': 0.3,
  'quality': 0.2,
  'ease': 0.2
}

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

    let name = cityObj.info.city.name;

    let racism = cityObj.scores.racism;
    let lgbt_friendly = cityObj.scores.lgbt_friendly;
    let friendly_to_foreigners = cityObj.scores.friendly_to_foreigners;
    let female_friendly = cityObj.scores.female_friendly;
    let peace_score = cityObj.scores.peace_score;
    let press_freedom_index = cityObj.scores.press_freedom_index;
    let safety = cityObj.scores.safety;

    let nightlife = cityObj.scores.nightlife;
    let weather = cityObj.info.weather.type;

    let aircon = cityObj.scores.aircon;
    let life_score = cityObj.scores.life_score;

    let download = cityObj.info.internet.speed.download;
    let places_to_work = cityObj.scores.places_to_work;
    let free_wifi_available = cityObj.scores.free_wifi_available;
    let leisure = cityObj.scores.leisure;
    let nomad_score = cityObj.scores.nomad_score;


    db.cypher({
      query: `MERGE (c:City {name: "${name}"}) \
      ON CREATE SET c.name = "${name}" \ 
        ON MATCH SET c.racism = "${racism}" \ 
        ON MATCH SET c.lgbt_friendly = "${lgbt_friendly}" \ 
        ON MATCH SET c.friendly_to_foreigners = "${friendly_to_foreigners}" \ 
        ON MATCH SET c.female_friendly = "${female_friendly}" \ 
        ON MATCH SET c.peace_score = "${peace_score}" \ 
        ON MATCH SET c.press_freedom_index = "${press_freedom_index}" \ 
        ON MATCH SET c.safety = "${safety}" \ 
        ON MATCH SET c.nightlife = "${nightlife}" \ 
        ON MATCH SET c.weather = "${weather}" \ 
        ON MATCH SET c.aircon = "${aircon}" \ 
        ON MATCH SET c.life_score = "${life_score}" \ 
        ON MATCH SET c.download = "${download}" \ 
        ON MATCH SET c.places_to_work = "${places_to_work}" \ 
        ON MATCH SET c.free_wifi_available = "${free_wifi_available}" \ 
        ON MATCH SET c.leisure = "${leisure}" \ 
        ON MATCH SET c.nomad_score = "${nomad_score}" \
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