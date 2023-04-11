// Create the company
CREATE (companyA:Company {id: 'DanfossID', name: 'Danfoss', description: 'Danfoss is a global company that specializes in energy-efficient solutions that help reduce emissions and save energy. Their products and services include refrigeration, heating, air conditioning, and motion controls for a wide range of industries, such as food and beverage, industrial automation, and renewable energy. With a history dating back to 1933, Danfoss has grown into a leading supplier of innovative technologies that improve efficiency, reliability, and sustainability.'})

// Create the plants
CREATE (plantA:Plant {id: 'danfossHQ', name: 'Danfoss headquarters Nordborg', description: 'the companys largest production facility. This plant produces a wide range of products, including hydraulics, drives, and other components for industrial and mobile applications.'})
CREATE (plantB:Plant {id: 'DPEGraasten', name: 'Danfoss Power Electronics Graasten', description: 'specializes in the production of power electronics for renewable energy, drives, and grid-tied energy storage systems. This facility is one of the worlds largest production sites for power electronics, and it plays a significant role in the companys efforts to advance energy efficiency and sustainability.'})

CREATE (companyA)-[:has]->(plantA)
CREATE (companyA)-[:has]->(plantB)
// Create the areas
CREATE (areaA:Area:ManufacturingFacility:Resource {id: 'MachiningNordborg', name: 'Machining', description: 'This area involves the production of metal components using computer-controlled machining equipment. It includes activities such as milling, turning, and drilling, and it requires skilled operators and engineers to ensure that components are produced accurately and efficiently.'})
CREATE (areaB:Area:ManufacturingFacility:Resource {id: 'AssemblyNordborg', name: 'Assembly', description: 'This area involves the assembly of components into finished products. It includes activities such as fitting, fastening, and wiring, and it requires careful attention to detail to ensure that products are assembled correctly and that they meet quality standards.'})
CREATE (areaC:Area:ManufacturingFacility:Resource {id: 'MachiningGraasten', name: 'Machining', description: 'This area involves the production of metal components using computer-controlled machining equipment. It includes activities such as milling, turning, and drilling, and it requires skilled operators and engineers to ensure that components are produced accurately and efficiently.'})
CREATE (areaD:Area:ManufacturingFacility:Resource {id: 'AssemblyGraasten', name: 'Assembly', description: 'This area involves the assembly of components into finished products. It includes activities such as fitting, fastening, and wiring, and it requires careful attention to detail to ensure that products are assembled correctly and that they meet quality standards.'})


// create relationships
CREATE (plantA)-[:has]->(areaA)
CREATE (plantA)-[:has]->(areaB)
CREATE (plantB)-[:has]->(areaC)
CREATE (plantB)-[:has]->(areaD)
// Create the lines
CREATE (lineA:Line:ManufacturingFacility:Resource {id: 'lineAID', name: 'Machining Line 1', description: 'This line includes a series of computer-controlled machines that perform precision machining operations on metal components. It may include equipment such as lathes, milling machines, and grinders, and it requires skilled operators and engineers to ensure that components are produced accurately and efficiently. The line may be divided into sub-lines or cells, each with its own specialized equipment and processes.'})
CREATE (lineB:Line:ManufacturingFacility:Resource {id: 'lineBID', name: 'Assembly Line 1', description: 'This line includes a series of workstations where operators assemble components into finished products. It may include equipment such as conveyors, lifts, and tooling, and it requires careful attention to detail to ensure that products are assembled correctly and that they meet quality standards. The line may be designed to accommodate different product types or variations, and it may incorporate quality control checkpoints to ensure that products meet specifications before they move to the next stage of production.'})
CREATE (lineC:Line:ManufacturingFacility:Resource {id: 'lineAID', name: 'Machining Line 1', description: 'This line includes a series of computer-controlled machines that perform precision machining operations on metal components. It may include equipment such as CNC milling machines, lathes, and grinders, and it requires skilled operators and engineers to ensure that components are produced accurately and efficiently. The line may be designed to accommodate different product types or variations, and it may incorporate quality control checkpoints to ensure that components meet specifications before they move to the next stage of production.'})
CREATE (lineD:Line:ManufacturingFacility:Resource {id: 'lineBID', name: 'Assembly Line 1', description: 'This line includes a series of workstations where operators assemble components into finished products. It may include equipment such as conveyors, lifts, and tooling, and it requires careful attention to detail to ensure that products are assembled correctly and that they meet quality standards. The line may be designed to accommodate different product types or variations, and it may incorporate quality control checkpoints to ensure that products meet specifications before they move to the next stage of production. The line may also include semi-automated or fully automated workstations to optimize efficiency and reduce labor costs.'})

// create relationships
CREATE (areaA)-[:has]->(lineA)
CREATE (areaB)-[:has]->(lineB)
CREATE (areaC)-[:has]->(lineC)
CREATE (areaD)-[:has]->(lineD)

// Create the cells
CREATE (cellA:Cell:ManufacturingFacility:Resource {id: 'cellAID', name: 'Machining Cell 1', description: 'This cell specializes in the production of precision components for Danfosss industrial refrigeration and air conditioning systems. It includes equipment such as CNC mills and lathes, and it requires operators with expertise in working with different materials and production processes. The cell may be designed to produce high volumes of components with tight tolerances and surface finishes.'})
CREATE (cellB:Cell:ManufacturingFacility:Resource {id: 'cellBID', name: 'Machining Cell 2', description: 'This cell focuses on the production of custom components for Danfosss hydraulic and mechanical systems. It includes equipment such as grinders and drilling machines, and it requires operators with expertise in working with different materials and production processes. The cell may be designed to produce lower volumes of components with greater flexibility and customization.'})
CREATE (cellC:Cell:ManufacturingFacility:Resource {id: 'cellCID', name: 'Assembly Cell 1', description: 'This cell focuses on the assembly of Danfosss industrial refrigeration and air conditioning systems. It includes equipment such as workstations with assembly jigs and fixtures, and it requires skilled operators and engineers to ensure that assemblies are produced to high quality standards and performance requirements.'})
CREATE (cellD:Cell:ManufacturingFacility:Resource {id: 'cellDID', name: 'Assembly Cell 2', description: 'This cell specializes in the assembly of Danfosss hydraulic systems and components. It includes equipment such as hydraulic presses and torque tools, and it requires operators with expertise in working with hydraulic components and systems. The cell may be designed to produce larger and more complex assemblies with a higher degree of customization'})

CREATE (cellE:Cell:ManufacturingFacility:Resource {id: 'cellEID', name: 'Machining Cell 1 ', description: 'This cell focuses on the production of precision components used in Danfosss advanced drives and controls systems. It includes specialized equipment such as CNC mills and grinders, and it requires highly skilled operators and engineers to ensure that components are produced to tight tolerances and surface finishes.'})
CREATE (cellF:Cell:ManufacturingFacility:Resource {id: 'cellFID', name: 'Machining Cell 2', description: 'This cell specializes in the production of custom components for Danfosss industrial refrigeration and air conditioning systems. It includes equipment such as lathes and drilling machines, and it requires operators with expertise in working with different materials and production processes.'})
CREATE (cellG:Cell:ManufacturingFacility:Resource {id: 'cellGID', name: 'Assembly Cell 1 ', description: 'This cell focuses on the assembly of Danfosss advanced hydraulic systems and components. It includes specialized equipment such as hydraulic presses and torque tools, and it requires skilled operators and engineers to ensure that assemblies are produced to high quality standards and performance requirements.'})
CREATE (cellH:Cell:ManufacturingFacility:Resource {id: 'cellHID', name: 'Assembly Cell 2', description: 'This cell specializes in the assembly of Danfosss electrical drive systems for industrial automation and renewable energy applications. It includes equipment such as workstations with assembly jigs and fixtures, and it requires operators with expertise in electrical and mechanical assembly processes'})

// create relationships
CREATE (lineA)-[:has]->(cellA)
CREATE (lineA)-[:has]->(cellB)
CREATE (lineB)-[:has]->(cellC)
CREATE (lineB)-[:has]->(cellD)
CREATE (lineC)-[:has]->(cellE)
CREATE (lineC)-[:has]->(cellF)
CREATE (lineD)-[:has]->(cellG)
CREATE (lineD)-[:has]->(cellH)


CREATE (machine1A:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell1_Machine1', name: 'CNC Milling Machine', description: 'Used for precision milling of metal components'})
CREATE (machine1B:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell1_Machine2', name: 'Lathe Machine', description: 'Used for turning and drilling of metal components'})
CREATE (machine2A:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell2_Machine1', name: 'Welding Robot', description: 'Used for automated welding of metal components'})
CREATE (machine2B:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell2_Machine2', name: 'Surface Grinder', description: 'Used for precision grinding of metal components'})
CREATE (machine3A:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell1_Machine1', name: 'CNC Turning Center', description: 'Used for turning and drilling of metal components'})
CREATE (machine3B:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell1_Machine2', name: 'Grinding Machine', description: 'Used for precision grinding of metal components'})
CREATE (machine4A:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell2_Machine1', name: 'Assembly Robot', description: 'Used for automated assembly of components'})
CREATE (machine4B:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell2_Machine2', name: 'Testing Station', description: 'Used for functional testing of assembled components'})

CREATE (lathe1:Machine:ManufacturingFacility:Resource {id: 'lathe1ID', name: 'Lathe 1', description: 'High-precision CNC lathe for turning metal parts'})
CREATE (milling1:Machine:ManufacturingFacility:Resource {id: 'milling1ID', name: 'Milling 1', description: 'Vertical milling machine for machining metal parts'})
CREATE (grinder1:Machine:ManufacturingFacility:Resource {id: 'grinder1ID', name: 'Grinder 1', description: 'High-precision cylindrical grinder for grinding metal parts'})
CREATE (drill1:Machine:ManufacturingFacility:Resource {id: 'drill1ID', name: 'Drill 1', description: 'Automatic drill press for drilling precise holes in metal parts'})
CREATE (robot1:Machine:ManufacturingFacility:Resource {id: 'robot1ID', name: 'Robot 1', description: 'Six-axis industrial robot for assembling metal components'})
CREATE (welder1:Machine:ManufacturingFacility:Resource {id: 'welder1ID', name: 'Welder 1', description: 'Automated welding machine for joining metal parts'})
CREATE (press1:Machine:ManufacturingFacility:Resource {id: 'press1ID', name: 'Press 1', description: 'Hydraulic press for pressing metal components'})
CREATE (rivet1:Machine:ManufacturingFacility:Resource {id: 'rivet1ID', name: 'Rivet 1', description: 'Pneumatic riveting machine for fastening metal parts'})

CREATE (cellA)-[:has]->(machine1A)
CREATE (cellA)-[:has]->(machine1B)
CREATE (cellB)-[:has]->(machine2A)
CREATE (cellB)-[:has]->(machine2B)
CREATE (cellC)-[:has]->(machine3A)
CREATE (cellC)-[:has]->(machine3B)
CREATE (cellD)-[:has]->(machine4A)
CREATE (cellD)-[:has]->(machine4B)
CREATE (cellE)-[:has]->(lathe1)
CREATE (cellE)-[:has]->(milling1)
CREATE (cellF)-[:has]->(grinder1)
CREATE (cellF)-[:has]->(drill1)
CREATE (cellG)-[:has]->(robot1)
CREATE (cellG)-[:has]->(welder1)
CREATE (cellH)-[:has]->(press1)
CREATE (cellH)-[:has]->(rivet1)


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

CREATE (cuttingSpeed:ObservableProperty {
id: 'cuttingSpeed',
name: 'Cutting Speed',
description: 'Observable Property for Cutting Speed of CNC Milling Machine in Nordborg Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: "cuttingSpeedConnectionDetails",
dataFormat: "RAW"
})

CREATE (toolWear:ObservableProperty {
id: 'toolWear',
name: 'Tool Wear',
description: 'Observable Property for Tool Wear of CNC Milling Machine in Nordborg Machining Line Cell 1',
frequency: 75,
changedFrequency: 25,
connectionDetails: "toolWearConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (machine1A)-[:has]->(cuttingSpeed)
CREATE (machine1A)-[:has]->(toolWear)


CREATE (vibration:ObservableProperty {
id: 'vibration',
name: 'Vibration',
description: 'Observable Property for Vibration of Lathe Machine in Nordborg Machining Line Cell 1',
frequency: 50,
changedFrequency: 50,
connectionDetails: "vibrationConnectionDetails",
dataFormat: "RAW"
})

CREATE (cuttingForce:ObservableProperty {
id: 'cuttingForce',
name: 'Cutting Force',
description: 'Observable Property for Cutting Force of Lathe Machine in Nordborg Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: "cuttingForceConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (temperature:ObservableProperty {
id: 'temperature',
name: 'Temperature',
description: 'Observable Property for Temperature of Welding Robot in Nordborg Welding Line Cell 2',
frequency: 75,
changedFrequency: 75,
connectionDetails: "temperatureConnectionDetails",
dataFormat: "RAW"
})

CREATE (weldingVoltage:ObservableProperty {
id: 'weldingVoltage',
name: 'Welding Voltage',
description: 'Observable Property for Welding Voltage of Welding Robot in Nordborg Welding Line Cell 2',
frequency: 50,
changedFrequency: 50,
connectionDetails: "weldingVoltageConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (machine1B)-[:has]->(vibration)
CREATE (machine1B)-[:has]->(cuttingForce)
CREATE (machine2A)-[:has]->(temperature)
CREATE (machine2A)-[:has]->(weldingVoltage)


CREATE (machine2B)-[:has]->(vibration:ObservableProperty {
    id: 'vibration',
    name: 'Vibration',
    description: 'Observable Property for Vibration of Surface Grinder in Nordborg Machining Line Cell 2',
    frequency: 50,
    changedFrequency: 50,
    connectionDetails: "vibrationConnectionDetails",
    dataFormat: "WITH_METADATA"
})

CREATE (machine2B)-[:has]->(temperature:ObservableProperty {
    id: 'temperature',
    name: 'Temperature',
    description: 'Observable Property for Temperature of Surface Grinder in Nordborg Machining Line Cell 2',
    frequency: 75,
    changedFrequency: 75,
    connectionDetails: "temperatureConnectionDetails",
    dataFormat: "RAW"
})

CREATE (machine3A)-[:has]->(position:ObservableProperty {
    id: 'position',
    name: 'Position',
    description: 'Observable Property for Position of CNC Turning Center in Graasten Machining Line Cell 1',
    frequency: 100,
    changedFrequency: 50,
    connectionDetails: "positionConnectionDetails",
    dataFormat: "RAW"
})

CREATE (machine3A)-[:has]->(pressure:ObservableProperty {
    id: 'pressure',
    name: 'Pressure',
    description: 'Observable Property for Pressure of CNC Turning Center in Graasten Machining Line Cell 1',
    frequency: 50,
    changedFrequency: 50,
    connectionDetails: "pressureConnectionDetails",
    dataFormat: "WITH_METADATA"
})

CREATE (machine3B)-[:has]->(vibration:ObservableProperty {
    id: 'vibration',
    name: 'Vibration',
    description: 'Observable Property for Vibration of Grinding Machine in Graasten Machining Line Cell 1',
    frequency: 100,
    changedFrequency: 50,
    connectionDetails: "vibrationConnectionDetails",
    dataFormat: "RAW"
})

CREATE (machine3B)-[:has]->(temperature:ObservableProperty {
    id: 'temperature',
    name: 'Temperature',
    description: 'Observable Property for Temperature of Grinding Machine in Graasten Machining Line Cell 1',
    frequency: 75,
    changedFrequency: 75,
    connectionDetails: "temperatureConnectionDetails",
    dataFormat: "WITH_METADATA"
})





CREATE (lathe1Temp:ObservableProperty {
id: 'lathe1Temp',
name: 'Lathe 1 Temperature',
description: 'Temperature of the Lathe 1 spindle',
frequency: 50,
changedFrequency: 50,
connectionDetails: "lathe1TempConnectionDetails",
dataFormat: "RAW"
})
CREATE (lathe1Vibration:ObservableProperty {
id: 'lathe1Vibration',
name: 'Lathe 1 Vibration',
description: 'Vibration of the Lathe 1 spindle',
frequency: 100,
changedFrequency: 50,
connectionDetails: "lathe1VibrationConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (milling1Temp:ObservableProperty {
id: 'milling1Temp',
name: 'Milling 1 Temperature',
description: 'Temperature of the Milling 1 spindle',
frequency: 75,
changedFrequency: 50,
connectionDetails: "milling1TempConnectionDetails",
dataFormat: "RAW"
})
CREATE (milling1Load:ObservableProperty {
id: 'milling1Load',
name: 'Milling 1 Load',
description: 'Load on the Milling 1 spindle',
frequency: 150,
changedFrequency: 75,
connectionDetails: "milling1LoadConnectionDetails",
dataFormat: "WITH_METADATA"
})
CREATE (grinder1Temp:ObservableProperty {
id: 'grinder1Temp',
name: 'Grinder 1 Temperature',
description: 'Temperature of the Grinder 1 spindle',
frequency: 50,
changedFrequency: 50,
connectionDetails: "grinder1TempConnectionDetails",
dataFormat: "RAW"
})
CREATE (grinder1Vibration:ObservableProperty {
id: 'grinder1Vibration',
name: 'Grinder 1 Vibration',
description: 'Vibration of the Grinder 1 spindle',
frequency: 100,
changedFrequency: 50,
connectionDetails: "grinder1VibrationConnectionDetails",
dataFormat: "WITH_METADATA"
})
CREATE (drill1Temp:ObservableProperty {
id: 'drill1Temp',
name: 'Drill 1 Temperature',
description: 'Temperature of the Drill 1 motor',
frequency: 75,
changedFrequency: 50,
connectionDetails: "drill1TempConnectionDetails",
dataFormat: "RAW"
})
CREATE (drill1Load:ObservableProperty {
id: 'drill1Load',
name: 'Drill 1 Load',
description: 'Load on the Drill 1 motor',
frequency: 150,
changedFrequency: 75,
connectionDetails: "drill1LoadConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (cuttingSpeed:ObservableProperty {
id: 'cuttingSpeed',
name: 'Cutting Speed',
description: 'Observable Property for Cutting Speed of Machine A in Nordborg Machining Line Cell 1',
frequency: 150,
changedFrequency: 100,
connectionDetails: "cuttingSpeedConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (toolLife:ObservableProperty {
id: 'toolLife',
name: 'Tool Life',
description: 'Observable Property for Tool Life of Machine A in Nordborg Machining Line Cell 1',
frequency: 50,
changedFrequency: 50,
connectionDetails: "toolLifeConnectionDetails",
dataFormat: "RAW"
})

CREATE (assemblySpeed:ObservableProperty {
id: 'assemblySpeed',
name: 'Assembly Speed',
description: 'Observable Property for Assembly Speed of Machine B in Nordborg Assembly Line Cell 2',
frequency: 75,
changedFrequency: 50,
connectionDetails: "assemblySpeedConnectionDetails",
dataFormat: "WITH_METADATA"
})

CREATE (vibration:ObservableProperty {
id: 'vibration',
name: 'Vibration',
description: 'Observable Property for Vibration of Machine B in Nordborg Assembly Line Cell 2',
frequency: 100,
changedFrequency: 75,
connectionDetails: "vibrationConnectionDetails",
dataFormat: "RAW"
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
CREATE (machineA)-[:has]->(jointTemperature)
CREATE (machineA)-[:has{frequency:100}]->(jointTemperature2)
CREATE (machineC)-[:has{frequency:100}]->(jointPressure)
CREATE (machineD)-[:has{frequency:100}]->(jointPressure2)
CREATE (machineD)-[:has{frequency:100}]->(jointVibration)
CREATE (machineF)-[:has{frequency:100}]->(jointVibration2)
