// find observable properties that are related to cell b
MATCH (b:Cell)-[* 1..4]->(s:ObservableProperty)
WHERE b.name = "Cell A"
RETURN b, s

// find all resources
MATCH (r:Resource) return r