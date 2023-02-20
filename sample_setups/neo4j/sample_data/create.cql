// Create the company
CREATE (companyA:Company {name: 'Company A'})

// Create the plants
CREATE (plantA:Plant {name: 'Plant A'})
CREATE (plantB:Plant {name: 'Plant B'})

CREATE (companyA)-[:has]->(plantA)
CREATE (companyA)-[:has]->(plantB)
// Create the areas
CREATE (areaA:Area:ManufacturingFacility:Resource {name: 'Area A'})
CREATE (areaB:Area:ManufacturingFacility:Resource {name: 'Area B'})


// create relationships
CREATE (plantA)-[:has]->(areaA)
CREATE (plantB)-[:has]->(areaB)
// Create the lines
CREATE (lineA:Line:ManufacturingFacility:Resource {name: 'Line A'})
CREATE (lineB:Line:ManufacturingFacility:Resource {name: 'Line B'})

// create relationships
CREATE (areaA)-[:has]->(lineA)
CREATE (areaB)-[:has]->(lineB)

// Create the cells
CREATE (cellA:Cell:ManufacturingFacility:Resource {name: 'Cell A'})
CREATE (cellB:Cell:ManufacturingFacility:Resource {name: 'Cell B'})
CREATE (cellC:Cell:ManufacturingFacility:Resource {name: 'Cell C'})
CREATE (cellD:Cell:ManufacturingFacility:Resource {name: 'Cell D'})

// create relationships
CREATE (lineA)-[:has]->(cellA)
CREATE (lineA)-[:has]->(cellB)
CREATE (lineB)-[:has]->(cellC)
CREATE (lineB)-[:has]->(cellD)

// Create the machines
CREATE (machineA:Machine:ManufacturingFacility:Resource {name: 'Machine A'})
CREATE (machineB:Machine:ManufacturingFacility:Resource {name: 'Machine B'})
CREATE (machineC:Machine:ManufacturingFacility:Resource {name: 'Machine C'})
CREATE (machineD:Machine:ManufacturingFacility:Resource {name: 'Machine D'})
CREATE (machineE:Machine:ManufacturingFacility:Resource {name: 'Machine E'})
CREATE (machineF:Machine:ManufacturingFacility:Resource {name: 'Machine F'})

// create relationships
CREATE (cellA)-[:has]->(machineA)
CREATE (cellA)-[:has]->(machineB)
CREATE (cellB)-[:has]->(machineC)
CREATE (cellB)-[:has]->(machineD)
CREATE (cellC)-[:has]->(machineE)
CREATE (cellD)-[:has]->(machineF)


// Create Staff
CREATE (managerA:Staff:Resource {name: 'Manager A'})
CREATE (operatorA:Staff:Resource {name: 'Operator A'})
CREATE (operatorB:Staff:Resource {name: 'Operator B'})
CREATE (researcherA:Staff:Resource {name: 'Researcher A'})
CREATE (maintenanceA:Staff:Resource {name: 'Maintenance A'})

// Create relationships
CREATE (plantA)-[:has]->(managerA)
CREATE (cellA)-[:has]->(operatorA)
CREATE (cellB)-[:has]->(operatorB)
CREATE (areaA)-[:has]->(researcherA)
CREATE (cellA)-[:has]->(maintenanceA)

CREATE (companyA)-[:has]->(managerA)
CREATE (companyA)-[:has]->(operatorA)
CREATE (companyA)-[:has]->(operatorB)
CREATE (companyA)-[:has]->(researcherA)
CREATE (companyA)-[:has]->(maintenanceA)

// Create the Products
CREATE (product:Product {name: 'Product'})


// Create the observable properties
CREATE (jointTemperature:ObservableProperty {
    id: 'jointTemperature',
    name: 'Joint Temperature',
    frequency: 100
    })
CREATE (jointTemperature2:ObservableProperty {
    id: 'jointTemperature2',
    name: 'Joint Temperature 2',
    frequency: 100
    })
CREATE (jointPressure:ObservableProperty {
    id: 'jointPressure',
    name: 'Joint Pressure',
    frequency: 100
    })
CREATE (jointPressure2:ObservableProperty {
    id: 'jointPressure2',
    name: 'Joint Pressure 2',
    frequency: 100
    })
CREATE (jointVibration:ObservableProperty {
    id: 'jointVibration',
    name: 'Joint Vibration',
    frequency: 100
    })
CREATE (jointVibration2:ObservableProperty {
    id: 'jointVibration2',
    name: 'Joint Vibration 2',
    frequency: 100
    })


// Create topics
CREATE (topicA:Topic {name: 'TopicA'})
CREATE (topicB:Topic {name: 'TopicB'})
CREATE (topicC:Topic {name: 'TopicC'})
CREATE (topicD:Topic {name: 'TopicD'})
CREATE (topicE:Topic {name: 'TopicE'})
CREATE (topicF:Topic {name: 'TopicF'})

//create relationships
CREATE (jointTemperature)-[:has]->(topicA)
CREATE (jointTemperature2)-[:has]->(topicB)
CREATE (jointPressure)-[:has]->(topicC)
CREATE (jointPressure2)-[:has]->(topicD)
CREATE (jointVibration)-[:has]->(topicE)
CREATE (jointVibration2)-[:has]->(topicF)

// Create relationships
CREATE (machineA)-[:has{frequency:100}]->(jointTemperature)
CREATE (machineA)-[:has{frequency:100}]->(jointTemperature2)
CREATE (machineC)-[:has{frequency:100}]->(jointPressure)
CREATE (machineD)-[:has{frequency:100}]->(jointPressure2)
CREATE (machineD)-[:has{frequency:100}]->(jointVibration)
CREATE (machineF)-[:has{frequency:100}]->(jointVibration2)