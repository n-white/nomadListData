// LOAD CSV WITH HEADERS FROM 'file:///Locations.csv' AS csvLine
// MERGE (l:Location {name:csvLine.destination});

LOAD CSV WITH HEADERS FROM 'file:///Months.csv' AS csvLine
MERGE (m:Month {name:csvLine.name})
ON MATCH SET m.month = {name:csvLine.name};

LOAD CSV WITH HEADERS FROM 'file:///SubActivity.csv' AS csvLine
MERGE (s:SubActivity {name:csvLine.name});

LOAD CSV WITH HEADERS FROM 'file:///Activity.csv' AS csvLine
MERGE (a:Activity {name:csvLine.name})
MERGE (sa1:SubActivity {name:csvLine.sub_category_1})
MERGE (sa2:SubActivity {name:csvLine.sub_category_2})
MERGE (sa3:SubActivity {name:csvLine.sub_category_3})
MERGE (sa4:SubActivity {name:csvLine.sub_category_4})
CREATE (a)<-[:BELONGS_TO]-(sa1)
CREATE (a)<-[:BELONGS_TO]-(sa2)
CREATE (a)<-[:BELONGS_TO]-(sa3)
CREATE (a)<-[:BELONGS_TO]-(sa4);



MATCH (a1 {name:"ruins"})<-[:BELONGS]-(n)-[:BELONGS]->(a2 {name:"street_art_food"}),
(a3 {name:"spa"})<-[:BELONGS]-(n),
(n)-[:MONTHS_TO_VISIT]-(m)
WHERE (m.name=1 OR m.name=2) AND
n.ancient_to_modern < 3.5
return a1, a2, a3, n, m;

