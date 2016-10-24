const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase(`http://neo4j:cake@127.0.0.1:7474`);
const bluebird = require('bluebird');
const locationData = require('./location.json');


// This function saves only one city
const saveCity = (cityObj) => (
  new Promise((resolve, reject) => {

    // Using the neo4j raw cypher querying language to save one city node
    let cityData = {
      'name': cityObj.destination,
      'activity': [],
    }

    // Add all activities to the city
    for (key in cityObj) {
      if (cityObj[key] === "x") {
        cityData.activity.push('"' + key + '"');
      }
    }

    console.log('!', cityData.name)

    // Cypher query to add one city node
    db.cypher({
      query: `MERGE (l:Location {name: "${cityData.name}"}) \
        FOREACH( i in [${cityData.activity}] |
        MERGE (a {name:i})
        MERGE (l)-[:BELONGS]->(a));`,
    }, (err, newCity) => {
      if (err) {
        console.log(`error adding city: ${err}`);
        reject(err);
      } else {
        // console.log(`city added ${cityObj.info.city.name}`)
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

recursiveAdd(locationData);
