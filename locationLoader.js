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
      'ancient_to_modern': cityObj.ancient_to_modern,
      'months_to_visit': JSON.parse(cityObj.months),
      'avg_flight_rt_sfo': cityObj.avg_flight_rt_sfo,
      'avg_flight_ow_sfo': cityObj.avg_flight_ow_sfo,
      'avg_flight_ow_jfk': cityObj.avg_flight_ow_jfk,
      'avg_flight_rt_jfk': cityObj.avg_flight_rt_jfk,
      'budget': cityObj.budget,
      'ease': cityObj.ease
    }

    console.log('Updating:', cityData.name);

    // Add all activities to the city
    for (key in cityObj) {
      if (cityObj[key] === "x") {
        cityData.activity.push('"' + key + '"');
      }
    }

    // Cypher query to add one city node
    db.cypher({
      query: `MERGE (l:Location {name: "${cityData.name}"}) \
        ON MATCH SET l.ancient_to_modern = ${cityData.ancient_to_modern} \
        ON MATCH SET l.avg_flight_rt_sfo = ${cityData.avg_flight_rt_sfo} \
        ON MATCH SET l.avg_flight_ow_sfo = ${cityData.avg_flight_ow_sfo} \
        ON MATCH SET l.avg_flight_ow_jfk = ${cityData.avg_flight_ow_jfk} \
        ON MATCH SET l.avg_flight_rt_jfk = ${cityData.avg_flight_rt_jfk} \
        ON MATCH SET l.budget = ${cityData.budget} \
        ON MATCH SET l.ease = ${cityData.ease} \
        FOREACH( j in [${cityData.months_to_visit}] |
        MERGE (m {name:j})
        MERGE (l)-[:MONTHS_TO_VISIT]-(m))
        FOREACH( i in [${cityData.activity}] |
        MERGE (a {name:i})
        MERGE (l)-[:BELONGS]-(a))        
        ;`,
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

// This function adds month nodes
const saveMonth = () => (
  new Promise((resolve, reject) => {
    
    // Cypher query to add all months
    db.cypher({
      query: `
        MERGE (m:Month {name:1}) \
        MERGE (:Month {name:2}) \
        MERGE (:Month {name:3}) \
        MERGE (:Month {name:4}) \
        MERGE (:Month {name:5}) \
        MERGE (:Month {name:6}) \
        MERGE (:Month {name:7}) \
        MERGE (:Month {name:8}) \
        MERGE (:Month {name:9}) \
        MERGE (:Month {name:10}) \
        MERGE (:Month {name:11}) \
        MERGE (:Month {name:12});`,
    }, (err, newCity) => {
      if (err) {
        console.log(`error adding months: ${err}`);
        reject(err);
      } else {
        console.log(`months added`)
        resolve('next');
      }
    });
  })
);

// This function adds SubActivity nodes
const saveActivities = () => (
  new Promise((resolve, reject) => {
    var cypherQuery = ''

    var subActivities = ['water_sports',
        'yoga',
        'tanning_cocktails',
        'diving_snorkeling',
        'architecture',
        'ruins',
        'art',
        'museums',
        'beach_lounge',
        'bars',
        'outdoor_festivals',
        'city_club',
        'hiking',
        'rafting',
        'biking',
        'creatures',
        'winery',
        'spa',
        'city_stroll',
        'shopping',
        'street_art_food',
        'cooking_class',
        'traditional_dance',
        'yoga'];

    subActivities.forEach((item) => {
      cypherQuery += `MERGE (:SubActivity {name:"${item}"}) `
    })

    console.log(cypherQuery)
    
    // Cypher query to add all months
    db.cypher({
      query: `${cypherQuery};`,
    }, (err, newCity) => {
      if (err) {
        console.log(`error adding months: ${err}`);
        reject(err);
      } else {
        console.log(`Activities added`)
        resolve('next');
      }
    });
  })
);

saveMonth().then(saveActivities().then(recursiveAdd(locationData)));
// recursiveAdd(locationData);
