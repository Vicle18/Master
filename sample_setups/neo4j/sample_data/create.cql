// Create the company
CREATE (companyA:Company {id: 'companyAID', name: 'Company A', description: 'company description'})

// Create the plants
CREATE (plantA:Plant {id: 'plantAID', name: 'Plant A', description: 'Plant description'})
CREATE (plantB:Plant {id: 'plantBID', name: 'Plant B', description: 'Plant description'})

CREATE (companyA)-[:has]->(plantA)
CREATE (companyA)-[:has]->(plantB)
// Create the areas
CREATE (areaA:Area:ManufacturingFacility:Resource {id: 'areaAID', name: 'Area A', description: 'Area description'})
CREATE (areaB:Area:ManufacturingFacility:Resource {id: 'areaBID', name: 'Area B', description: 'Area description'})


// create relationships
CREATE (plantA)-[:has]->(areaA)
CREATE (plantB)-[:has]->(areaB)
// Create the lines
CREATE (lineA:Line:ManufacturingFacility:Resource {id: 'lineAID', name: 'Line A', description: 'Line description'})
CREATE (lineB:Line:ManufacturingFacility:Resource {id: 'lineBID', name: 'Line B', description: 'Line description'})

// create relationships
CREATE (areaA)-[:has]->(lineA)
CREATE (areaB)-[:has]->(lineB)

// Create the cells
CREATE (cellA:Cell:ManufacturingFacility:Resource {id: 'cellAID', name: 'Cell A', description: 'Cell description'})
CREATE (cellB:Cell:ManufacturingFacility:Resource {id: 'cellBID', name: 'Cell B', description: 'Cell description'})
CREATE (cellC:Cell:ManufacturingFacility:Resource {id: 'cellCID', name: 'Cell C', description: 'Cell description'})
CREATE (cellD:Cell:ManufacturingFacility:Resource {id: 'cellDID', name: 'Cell D', description: 'Cell description'})

// create relationships
CREATE (lineA)-[:has]->(cellA)
CREATE (lineA)-[:has]->(cellB)
CREATE (lineB)-[:has]->(cellC)
CREATE (lineB)-[:has]->(cellD)

// Create the machines
CREATE (machineA:Machine:ManufacturingFacility:Resource {id: 'machineAID', name: 'Machine A', description: 'Machine description'})
CREATE (machineB:Machine:ManufacturingFacility:Resource {id: 'machineBID', name: 'Machine B', description: 'Machine description'})
CREATE (machineC:Machine:ManufacturingFacility:Resource {id: 'machineCID', name: 'Machine C', description: 'Machine description'})
CREATE (machineD:Machine:ManufacturingFacility:Resource {id: 'machineDID', name: 'Machine D', description: 'Machine description'})
CREATE (machineE:Machine:ManufacturingFacility:Resource {id: 'machineEID', name: 'Machine E', description: 'Machine description'})
CREATE (machineF:Machine:ManufacturingFacility:Resource {id: 'machineFID', name: 'Machine F', description: 'Machine description'})

// create relationships
CREATE (cellA)-[:has]->(machineA)
CREATE (cellA)-[:has]->(machineB)
CREATE (cellB)-[:has]->(machineC)
CREATE (cellB)-[:has]->(machineD)
CREATE (cellC)-[:has]->(machineE)
CREATE (cellD)-[:has]->(machineF)


// Create Staff
CREATE (managerA:Staff:Resource {id: 'managerAID', name: 'Manager A', description: 'Manager description'})
CREATE (operatorA:Staff:Resource {id: 'operatorAID', name: 'Operator A', description: 'Operator description'})
CREATE (operatorB:Staff:Resource {id: 'operatorBID', name: 'Operator B', description: 'Operator description'})
CREATE (researcherA:Staff:Resource {id: 'researcherAID', name: 'Researcher A', description: 'Researcher description'})
CREATE (maintenanceA:Staff:Resource {id: 'maintenanceAID', name: 'Maintenance A', description: 'Maintenance description'})

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
    description: 'Description of the Joint Temperature Observable Property',
    frequency: 100,
    changedFrequency: 100,
    connectionDetails: "jointTemperatureConnectionDetails",
    dataFormat: "RAW"

    })
CREATE (jointTemperature2:ObservableProperty {
    id: 'jointTemperature2',
    name: 'Joint Temperature 2',
    description: 'Description of the Joint Temperature 2 Observable Property',
    frequency: 100,
        changedFrequency: 100,
    dataFormat: "RAW",
    connectionDetails: "jointTemperature2ConnectionDetails"
    })
CREATE (jointPressure:ObservableProperty {
    id: 'jointPressure',
    name: 'Joint Pressure',
    description: 'Description of the Joint Pressure Observable Property',
    frequency: 100,
        changedFrequency: 100,
    dataFormat: "RAW",
    connectionDetails: "jointPressureConnectionDetails"
    })
CREATE (jointPressure2:ObservableProperty {
    id: 'jointPressure2',
    name: 'Joint Pressure 2',
    description: 'Description of the Joint Pressure 2 Observable Property',
    frequency: 100,
        changedFrequency: 100,
    dataFormat: "RAW",
    connectionDetails: "jointPressure2ConnectionDetails"

    })
CREATE (jointVibration:ObservableProperty {
    id: 'jointVibration',
    name: 'Joint Vibration',
    description: 'Description of the Joint Vibration Observable Property',
    frequency: 100,
        changedFrequency: 100,
    dataFormat: "RAW",
    connectionDetails: "jointVibrationConnectionDetails"
    })
CREATE (jointVibration2:ObservableProperty {
    id: 'jointVibration2',
    name: 'Joint Vibration 2',
    description: 'Description of the Joint Vibration 2 Observable Property',
    frequency: 100,
    changedFrequency: 100,
    dataFormat: "RAW",
    connectionDetails: "jointVibration2ConnectionDetails"
    })

CREATE (egress1:EgressEndpoint {
    id: "egress1",
    name: "Endpoint 1",
    description: "This is the first egress endpoint",
    connectionDetails: ['{ "PROTOCOL": "MQTT", "PARAMETERS": { "HOST": "localhost", "PORT": 1883, "TRANSMISSION_PAIRS": "mqttTopic:KafkaTopic,temp2:motor_temperature" } }'],
    frequency: [30],
    changedFrequency: [30],
    dataFormat: "Raw",
    egressGroup: "group1"

})

CREATE (egress2:EgressEndpoint {
    id: "egress2",
    name: "Endpoint 2",
    description: "This is the second egress endpoint",
    connectionDetails: ['{ "PROTOCOL": "MQTT", "PARAMETERS": { "HOST": "localhost", "PORT": 1883, "TRANSMISSION_PAIRS": "mqttTopic:KafkaTopic,temp2:motor_temperature" } }'],
    frequency: [30],
    changedFrequency: [30],
    dataFormat: "Json",
    egressGroup: "group2"
})


CREATE (egress3:EgressEndpoint {
    id: "egress3",
    name: "Endpoint 3",
    description: "This is the second egress endpoint",
    connectionDetails: ['{ "PROTOCOL": "OPCUA", "PARAMETERS": { "HOST": "localhost", "PORT": 1883, "TRANSMISSION_PAIRS": "mqttTopic:KafkaTopic,temp2:motor_temperature" } }'],
    frequency: [30],
    changedFrequency: [30],
    dataFormat: "Json",
    egressGroup: "group3"

})

CREATE (egress1)-[:accessVia]->(jointTemperature)
CREATE (egress1)-[:accessVia]->(jointTemperature2)

CREATE (egress2)-[:accessVia]->(jointVibration)
CREATE (egress2)-[:accessVia]->(jointVibration2)

CREATE (egress3)-[:accessVia]->(jointPressure)
CREATE (egress3)-[:accessVia]->(jointPressure2)



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
