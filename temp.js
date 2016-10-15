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

var newString = '';


for (key in weighting) {
	newString += 'ON MATCH SET c.' + key + ' = "${cityData.' + key+ '}" \\ \n'
}

var temp = '';

for (key in weighting) {
  temp += 'c.' + key + ', ';
}

console.log(temp)