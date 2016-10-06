const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase(`http://neo4j:cake@127.0.0.1:7474`);
const bluebird = require('bluebird');
const nomadData = require('./nomadData.json')

const saveCity = (cityObj) => (
  new Promise((resolve, reject) => {
    db.cypher({
      query: `MERGE (c:City {name: {name}}) \
      ON CREATE SET c.name = {name} \
	      ON MATCH SET c.airbnb_median = {airbnb_median} \
	      ON MATCH SET c.shortTerm = {shortTerm} \
	      ON MATCH SET c.monthsToVisit = {monthsToVisit} \
      RETURN c;`,
      params: {
        name: cityObj.info.city.name,
        airbnb_median: cityObj.cost.airbnb_median.USD,
        shortTerm: cityObj.cost.shortTerm.USD,
        monthsToVisit: cityObj.info.monthsToVisit
      },
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
	  if (cityArray.length === 0) {
	    return;
	  } else {
	    recursiveAdd(cityArray.slice(1));
	  }
	})
};

recursiveAdd(nomadData.result);