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
CREATE (lineC:Line:ManufacturingFacility:Resource {id: 'lineCID', name: 'Machining Line 1', description: 'This line includes a series of computer-controlled machines that perform precision machining operations on metal components. It may include equipment such as CNC milling machines, lathes, and grinders, and it requires skilled operators and engineers to ensure that components are produced accurately and efficiently. The line may be designed to accommodate different product types or variations, and it may incorporate quality control checkpoints to ensure that components meet specifications before they move to the next stage of production.'})
CREATE (lineD:Line:ManufacturingFacility:Resource {id: 'lineDID', name: 'Assembly Line 1', description: 'This line includes a series of workstations where operators assemble components into finished products. It may include equipment such as conveyors, lifts, and tooling, and it requires careful attention to detail to ensure that products are assembled correctly and that they meet quality standards. The line may be designed to accommodate different product types or variations, and it may incorporate quality control checkpoints to ensure that products meet specifications before they move to the next stage of production. The line may also include semi-automated or fully automated workstations to optimize efficiency and reduce labor costs.'})

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

//NORDBORG
CREATE (machine1A:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell1_Machine1', name: 'CNC Milling Machine', description: 'Used for precision milling of metal components'})
CREATE (machine1B:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell1_Machine2', name: 'Lathe Machine', description: 'Used for turning and drilling of metal components'})
CREATE (machine2A:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell2_Machine1', name: 'Welding Robot', description: 'Used for automated welding of metal components'})
CREATE (machine2B:Machine:ManufacturingFacility:Resource {id: 'Nordborg_Cell2_Machine2', name: 'Surface Grinder', description: 'Used for precision grinding of metal components'})
CREATE (machine3A:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell1_Machine1', name: 'CNC Turning Center', description: 'Used for turning and drilling of metal components'})
CREATE (machine3B:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell1_Machine2', name: 'Grinding Machine', description: 'Used for precision grinding of metal components'})
CREATE (machine4A:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell2_Machine1', name: 'Assembly Robot', description: 'Used for automated assembly of components'})
CREATE (machine4B:Machine:ManufacturingFacility:Resource {id: 'Graasten_Cell2_Machine2', name: 'Testing Station', description: 'Used for functional testing of assembled components'})

//GRAASTEN
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
connectionDetails: '{
  "PROTOCOL": "MQTT",
    "PARAMETERS": {
      "HOST": "22.48.159.115",
      "PORT": 2175,
      "TRANSMISSION_PAIRS": "cuttingSpeed:cuttingSpeed",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 0.5,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (toolWear:ObservableProperty {
id: 'toolWear',
name: 'Tool Wear',
description: 'Observable Property for Tool Wear of CNC Milling Machine in Nordborg Machining Line Cell 1',
frequency: 75,
changedFrequency: 25,
connectionDetails: '{
  "PROTOCOL": "MQTT",
    "PARAMETERS": {
      "HOST": "72.61.116.220",
      "PORT": 56730,
      "TRANSMISSION_PAIRS": "toolWear:toolWear",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 0.5,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (machine1A)-[:has]->(cuttingSpeed)
CREATE (machine1A)-[:has]->(toolWear)


CREATE (vibration1:ObservableProperty {
id: 'vibration',
name: 'Vibration',
description: 'Observable Property for Vibration of Lathe Machine in Nordborg Machining Line Cell 1',
frequency: 50,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "MQTT",
    "PARAMETERS": {
      "HOST": "56.69.102.204",
      "PORT": 4331,
      "TRANSMISSION_PAIRS": "vibration:vibration",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 0.5,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
  dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (cuttingForce:ObservableProperty {
id: 'cuttingForce',
name: 'Cutting Force',
description: 'Observable Property for Cutting Force of Lathe Machine in Nordborg Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "MQTT",
    "PARAMETERS": {
      "HOST": "159.136.57.223",
      "PORT": 18230,
      "TRANSMISSION_PAIRS": "cuttingForce:cuttingForce",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 0.5,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (temperature1:ObservableProperty {
id: 'temperature',
name: 'Temperature',
description: 'Observable Property for Temperature of Welding Robot in Nordborg Welding Line Cell 2',
frequency: 75,
changedFrequency: 75,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "212.205.206.230",
      "HOST": "49.147.93.44",
      "PORT": 7070,
      "TRANSMISSION_PAIRS": "timestamp:temperature",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (weldingVoltage:ObservableProperty {
id: 'weldingVoltage',
name: 'Welding Voltage',
description: 'Observable Property for Welding Voltage of Welding Robot in Nordborg Welding Line Cell 2',
frequency: 50,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "192.168.0.160",
      "HOST": "243.35.191.54",
      "PORT": 30004,
      "TRANSMISSION_PAIRS": "timestamp:weldingVoltage",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (machine1B)-[:has]->(vibration1)
CREATE (machine1B)-[:has]->(cuttingForce)
CREATE (machine2A)-[:has]->(temperature1)
CREATE (machine2A)-[:has]->(weldingVoltage)

CREATE (vibration2:ObservableProperty {
id: 'vibration',
name: 'Vibration',
description: 'Observable Property for Vibration of Surface Grinder in Nordborg Machining Line Cell 2',
frequency: 50,
changedFrequency: 25,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "170.255.42.208",
      "HOST": "34.191.186.246",
      "PORT": 30014,
      "TRANSMISSION_PAIRS": "timestamp:vibrationSurfaceGrinder",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (surfaceRoughness:ObservableProperty {
id: 'surfaceRoughness',
name: 'Surface Roughness',
description: 'Observable Property for Surface Roughness of Surface Grinder in Nordborg Machining Line Cell 2',
frequency: 75,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "MQTT",
    "PARAMETERS": {
      "HOST": "206.143.202.141",
      "PORT": 12230,
      "TRANSMISSION_PAIRS": "surfaceRoughness:surfaceRoughness",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 0.5,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (machine2B)-[:has]->(vibration2)
CREATE (machine2B)-[:has]->(surfaceRoughness)

CREATE (temperature2:ObservableProperty {
id: 'temperature',
name: 'Temperature',
description: 'Observable Property for Temperature of CNC Turning Center in Graasten Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "MQTT",
    "PARAMETERS": {
      "HOST": "216.14.54.104",
      "PORT": 49656,
      "TRANSMISSION_PAIRS": "temperatureCNC:temperatureCNC",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 0.5,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "RAW",
downsampleMethod: "Accumulated",
dataType:"STRING"
})

CREATE (toolLife:ObservableProperty {
id: 'toolLife',
name: 'Tool Life',
description: 'Observable Property for Tool Life of CNC Turning Center in Graasten Machining Line Cell 1',
frequency: 75,
changedFrequency: 25,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "108.169.120.17",
      "HOST": "38.89.41.89",
      "PORT": 49727,
      "TRANSMISSION_PAIRS": "timestamp:toolLife",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "WITH_METADATA",
downsampleMethod: "Accumulated",
dataType:"STRING"
})

CREATE (machine3A)-[:has]->(temperature2)
CREATE (machine3A)-[:has]->(toolLife)

CREATE (powerConsumption1:ObservableProperty {
id: 'powerConsumption',
name: 'Power Consumption',
description: 'Observable Property for Power Consumption of Grinding Machine in Graasten Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://40.235.8.196:63611/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "powerConsumption"
    }
}',
dataFormat: "RAW",
downsampleMethod: "Accumulated",
dataType:"STRING"
})

CREATE (grindingForce:ObservableProperty {
id: 'grindingForce',
name: 'Grinding Force',
description: 'Observable Property for Grinding Force of Grinding Machine in Graasten Machining Line Cell 1',
frequency: 75,
changedFrequency: 25,
connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://localhost:8888/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "testOPCUA"
    }
}
',
dataFormat: "WITH_METADATA",
downsampleMethod: "Accumulated",
dataType:"STRING"
})

CREATE (machine3B)-[:has]->(powerConsumption1)
CREATE (machine3B)-[:has]->(grindingForce)

CREATE (robotPosition:ObservableProperty {
  id: 'robotPosition',
  name: 'Robot Position',
  description: 'Observable Property for Position of Assembly Robot in Graasten Cell 2',
  frequency: 1000,
  changedFrequency: 500,
  connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://249.126.137.239:35805/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "robotPosition"
    }
}
',
  dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (robotStatus:ObservableProperty {
  id: 'robotStatus',
  name: 'Robot Status',
  description: 'Observable Property for Status of Assembly Robot in Graasten Cell 2',
  frequency: 100,
  changedFrequency: 50,
  connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "174.103.28.255",
      "HOST": "36.226.106.231",
      "PORT": 52228,
      "TRANSMISSION_PAIRS": "timestamp:robotStatus",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
    }',
  dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"

})

CREATE (machine4A)-[:has]->(robotPosition)
CREATE (machine4A)-[:has]->(robotStatus)

CREATE (testResult:ObservableProperty {
  id: 'testResult',
  name: 'Test Result',
  description: 'Observable Property for Test Results of Testing Station in Graasten Cell 2',
  frequency: 10,
  changedFrequency: 5,
    connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "67.91.139.147",
        "PORT": 41645,
        "TRANSMISSION_PAIRS": "testResult:testResult",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',  
  downsampleMethod: "Accumulated",
  dataType:"STRING",
  dataFormat: "WITH_METADATA"
})

CREATE (testStatus:ObservableProperty {
  id: 'testStatus',
  name: 'Test Status',
  description: 'Observable Property for Status of Testing Station in Graasten Cell 2',
  frequency: 50,
  changedFrequency: 25,
  connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "196.117.161.71",
        "PORT": 17462,
        "TRANSMISSION_PAIRS": "testStatus:testStatus",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
  downsampleMethod: "Accumulated",
  dataType:"STRING",
  dataFormat: "WITH_METADATA"
})

CREATE (machine4B)-[:has]->(testResult)
CREATE (machine4B)-[:has]->(testStatus)



// GRAASTEN
CREATE (vibration3:ObservableProperty {
id: 'vibration',
name: 'Vibration',
description: 'Observable Property for Vibration of Lathe 1 in the manufacturing facility',
frequency: 50,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "54.17.150.12",
      "HOST": "194.14.233.67",
      "PORT": 49664,
      "TRANSMISSION_PAIRS": "timestamp:vibrationLathe",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})


CREATE (lathe1)-[:has]->(vibration3)

CREATE (surfaceRoughness2:ObservableProperty {
id: 'surfaceRoughness',
name: 'Surface Roughness',
description: 'Observable Property for Surface Roughness of Milling 1 in the manufacturing facility',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "52.163.0.191",
        "PORT": 34395,
        "TRANSMISSION_PAIRS": "surfaceRoughnessMilling:surfaceRoughnessMilling",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (powerConsumption2:ObservableProperty {
id: 'powerConsumption',
name: 'Power Consumption',
description: 'Observable Property for Power Consumption of Milling 1 in the manufacturing facility',
frequency: 75,
changedFrequency: 25,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "76.35.116.39",
      "HOST": "43.71.20.167",
      "PORT": 6969,
      "TRANSMISSION_PAIRS": "timestamp:powerConsumptionMilling",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (milling1)-[:has]->(surfaceRoughness2)
CREATE (milling1)-[:has]->(powerConsumption2)

CREATE (vibration4:ObservableProperty {
id: 'vibration',
name: 'Vibration',
description: 'Observable Property for Vibration of Grinder 1 in Graasten Machining Line Cell 1',
frequency: 200,
changedFrequency: 100,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "130.230.247.203",
        "PORT": 46598,
        "TRANSMISSION_PAIRS": "vibrationGrinder:vibrationGrinder",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (temperature4:ObservableProperty {
id: 'temperature',
name: 'Temperature',
description: 'Observable Property for Temperature of Grinder 1 in Graasten Machining Line Cell 1',
frequency: 60,
changedFrequency: 30,
connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://201.189.246.192:32321/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "temperatureGrinder"
    }
}',
dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (grinder1)-[:has]->(vibration4)
CREATE (grinder1)-[:has]->(temperature4)

CREATE (rpm:ObservableProperty {
id: 'rpm',
name: 'RPM',
description: 'Observable Property for RPM of Drill 1 in Graasten Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "34.222.154.211",
        "PORT": 9999,
        "TRANSMISSION_PAIRS": "rpm:rpm",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (depth:ObservableProperty {
id: 'depth',
name: 'Drilling Depth',
description: 'Observable Property for Drilling Depth of Drill 1 in Graasten Machining Line Cell 1',
frequency: 60,
changedFrequency: 30,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "95.203.31.105",
      "HOST": "239.135.107.93",
      "PORT": 54318,
      "TRANSMISSION_PAIRS": "timestamp:depth",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (drill1)-[:has]->(rpm)
CREATE (drill1)-[:has]->(depth)

CREATE (robotStatus2:ObservableProperty {
id: 'robotStatus',
name: 'Robot Status',
description: 'Observable Property for Status of Robot 1 in Graasten Machining Line Cell 1',
frequency: 50,
changedFrequency: 25,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "88.40.67.139",
        "PORT": 18978,
        "TRANSMISSION_PAIRS": "robotStatusTopic:robotStatusTopic",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (powerConsumption3:ObservableProperty {
id: 'powerConsumption',
name: 'Power Consumption',
description: 'Observable Property for Power Consumption of Robot 1 in Graasten Machining Line Cell 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "171.222.192.56",
        "PORT": 12634,
        "TRANSMISSION_PAIRS": "powerConsumption1:powerConsumption1",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "WITH_METADATA",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (robot1)-[:has]->(robotStatus2)
CREATE (robot1)-[:has]->(powerConsumption3)

CREATE (voltage2:ObservableProperty {
id: 'voltage',
name: 'Voltage',
description: 'Observable Property for Voltage of Welder 1',
frequency: 50,
changedFrequency: 10,
connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://85.57.77.77:48611/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "voltageWelder"
    }
}',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (current:ObservableProperty {
id: 'current',
name: 'Current',
description: 'Observable Property for Current of Welder 1',
frequency: 50,
changedFrequency: 10,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "90.184.219.72",
        "PORT": 41099,
        "TRANSMISSION_PAIRS": "currentWelder:currentWelde",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (welder1)-[:has]->(voltage2)
CREATE (welder1)-[:has]->(current)

CREATE (force:ObservableProperty {
id: 'force',
name: 'Force',
description: 'Observable Property for Force of Press 1',
frequency: 100,
changedFrequency: 20,
connectionDetails: '{
    "PROTOCOL": "MQTT",
        "PARAMETERS": {
        "HOST": "48.120.32.4",
        "PORT": 48621,
        "TRANSMISSION_PAIRS": "forcePress:forcePress",
        "FREQUENCY": 30,
        "CHANGED_FREQUENCY": 0.5,
        "DATA_FORMAT": "WITH_METADATA",
        "METADATA": {
            "TIMESTAMP": true,
            "NAME": "DefaultName",
            "DESCRIPTION": "Default Description",
            "FREQUENCY": 30
        }
        }
    }',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (temperature5:ObservableProperty {
id: 'temperature',
name: 'Temperature',
description: 'Observable Property for Temperature of Press 1',
frequency: 10,
changedFrequency: 5,
connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://35.152.86.212:61737/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "temperaturePress"
    }
}',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (press1)-[:has]->(force)
CREATE (press1)-[:has]->(temperature5)

CREATE (airPressure:ObservableProperty {
id: 'airPressure',
name: 'Air Pressure',
description: 'Observable Property for Air Pressure of Rivet 1',
frequency: 20,
changedFrequency: 5,
connectionDetails: '{
  "PROTOCOL": "RTDE",
    "PARAMETERS": {
      "HOST2": "55.101.134.54",
      "HOST": "15.179.152.56",
      "PORT": 33849,
      "TRANSMISSION_PAIRS": "timestamp:airPressure",
      "FREQUENCY": 30,
      "CHANGED_FREQUENCY": 1,
      "DATA_FORMAT": "WITH_METADATA",
      "METADATA": {
        "TIMESTAMP": true,
        "NAME": "DefaultName",
        "DESCRIPTION": "Default Description",
        "FREQUENCY": 30
      }
    }
}',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (cycleTime:ObservableProperty {
id: 'cycleTime',
name: 'Cycle Time',
description: 'Observable Property for Cycle Time of Rivet 1',
frequency: 100,
changedFrequency: 50,
connectionDetails: '{
  "PROTOCOL": "OPCUA",
    "PARAMETERS": {
      "SERVER_URL": "opc.tcp://157.203.145.74:58210/freeopcua/server/",
      "NODE_NAME": "ns=6;s=::AsGlobalPV:MoveAssemblyPart",
      "VALUE_TYPE": "int",
      "TARGET_TOPIC": "cycleTime"
    }
}',
dataFormat: "RAW",
  downsampleMethod: "Accumulated",
  dataType:"STRING"
})

CREATE (rivet1)-[:has]->(airPressure)
CREATE (rivet1)-[:has]->(cycleTime)



CREATE (topicA:Topic {name: 'TopicA'})
CREATE (topicB:Topic {name: 'TopicB'})
CREATE (topicC:Topic {name: 'TopicC'})
CREATE (topicD:Topic {name: 'TopicD'})
CREATE (topicE:Topic {name: 'TopicE'})
CREATE (topicF:Topic {name: 'TopicF'})
CREATE (topicG:Topic {name: 'TopicG'})
CREATE (topicH:Topic {name: 'TopicH'})
CREATE (topicI:Topic {name: 'TopicI'})
CREATE (topicJ:Topic {name: 'TopicJ'})
CREATE (topicK:Topic {name: 'TopicK'})
CREATE (topicL:Topic {name: 'TopicL'})
CREATE (topicM:Topic {name: 'TopicM'})
CREATE (topicN:Topic {name: 'TopicN'})
CREATE (topicO:Topic {name: 'TopicO'})
CREATE (topicP:Topic {name: 'TopicP'})
CREATE (topicQ:Topic {name: 'TopicQ'})
CREATE (topicR:Topic {name: 'TopicR'})
CREATE (topicS:Topic {name: 'TopicS'})
CREATE (topicT:Topic {name: 'TopicT'})
CREATE (topicU:Topic {name: 'TopicU'})
CREATE (topicV:Topic {name: 'TopicV'})
CREATE (topicW:Topic {name: 'TopicW'})
CREATE (topicX:Topic {name: 'TopicX'})
CREATE (topicY:Topic {name: 'TopicY'})
CREATE (topicZ:Topic {name: 'TopicZ'})
CREATE (topicZA:Topic {name: 'TopicZA'})
CREATE (topicZB:Topic {name: 'TopicZB'})
CREATE (topicZC:Topic {name: 'TopicZC'})
CREATE (topicZD:Topic {name: 'TopicZD'})
CREATE (topicZE:Topic {name: 'TopicZE'})
CREATE (topicZF:Topic {name: 'TopicZF'})



CREATE (cuttingSpeed)-[:has]->(topicA)
CREATE (toolWear)-[:has]->(topicB)
CREATE (vibration1)-[:has]->(topicC)
CREATE (cuttingForce)-[:has]->(topicD)
CREATE (temperature1)-[:has]->(topicE)
CREATE (weldingVoltage)-[:has]->(topicF)
CREATE (vibration2)-[:has]->(topicG)
CREATE (surfaceRoughness)-[:has]->(topicH)
CREATE (temperature2)-[:has]->(topicI)
CREATE (vibration3)-[:has]->(topicJ) //Lathe1
CREATE (powerConsumption1)-[:has]->(topicK)
CREATE (grindingForce)-[:has]->(topicL)
CREATE (robotPosition)-[:has]->(topicM)
CREATE (robotStatus)-[:has]->(topicN)
CREATE (testResult)-[:has]->(topicO)
CREATE (testStatus)-[:has]->(topicP)
CREATE (vibration3)-[:has]->(topicQ)
CREATE (surfaceRoughness2)-[:has]->(topicR)
CREATE (powerConsumption2)-[:has]->(topicS)
CREATE (vibration4)-[:has]->(topicT)
CREATE (temperature4)-[:has]->(topicU)
CREATE (rpm)-[:has]->(topicV)
CREATE (depth)-[:has]->(topicW)
CREATE (robotStatus2)-[:has]->(topicX)
CREATE (powerConsumption3)-[:has]->(topicY)
CREATE (voltage2)-[:has]->(topicZ)
CREATE (current)-[:has]->(topicZA)
CREATE (force)-[:has]->(topicZB)
CREATE (temperature5)-[:has]->(topicZC)
CREATE (airPressure)-[:has]->(topicZD)
CREATE (cycleTime)-[:has]->(topicZE)





CREATE (egressVisual:EgressGroup {
  id: "egressVisual",
  name: "Visual",
  description: "Visual Egress Group"
})



CREATE (egressAnalysis:EgressGroup {
  id: "egressAnalysis",
  name: "Analysis",
  description: "Analysis Egress Group"
})



CREATE (egress1:EgressEndpoint {
    id: "egress1",
    name: "Drilling Depth Visual",
    description: "This is the first egress endpoint",
    connectionDetails: '{ "ID":"postman-pod1",
        "PROTOCOL":"MQTT",
        "PARAMETERS":{
            "HOST":"mqtt-broker-8341af19-8a7c-4a4f-b321-6cb7319e16c1",
            "PORT":"1883"
        },
        "TRANSMISSION_DETAILS":{
            "ORIGIN_TOPIC":"example",
            "FREQUENCY":"1",
            "TARGET":"exampleMQTT",
            "CHANGED_FREQUENCY":"1",
            "DOWN_SAMPLING_METHOD":"LATEST",
            "DATA_FORMAT": "WITH_METADATA",
            "METADATA": {
                "TIMESTAMP": false,
                "NAME": "postman",
                "FREQUENCY": 30
            }
        }
        }',
    frequency: 30,
    changedFrequency: 30,
    dataFormat: "RAW",
    status: "ACTIVE",
    lastUpdatedAt: "2020-05-01T12:00:00.000Z",
    errorStateAt: "2020-05-01T12:00:00.000Z"

})


CREATE (egress2:EgressEndpoint {
    id: "egress2",
    name: "Temperature Visual",
    description: "This is the second egress endpoint",
    connectionDetails: '{ "ID":"postman-pod1",
        "PROTOCOL":"MQTT",
        "PARAMETERS":{
            "HOST":"mqtt-broker-8341af19-8a7c-4a4f-b321-6cb7319e16c1",
            "PORT":"1883"
        },
        "TRANSMISSION_DETAILS":{
            "ORIGIN_TOPIC":"example",
            "FREQUENCY":"1",
            "TARGET":"exampleMQTT",
            "CHANGED_FREQUENCY":"1",
            "DOWN_SAMPLING_METHOD":"LATEST",
            "DATA_FORMAT": "WITH_METADATA",
            "METADATA": {
                "TIMESTAMP": false,
                "NAME": "postman",
                "FREQUENCY": 30
            }
        }}',
    frequency: 30,
    changedFrequency: 30,
    dataFormat: "WITH_METADATA",
    status: "ACTIVE",
    lastUpdatedAt: "2020-05-01T12:00:00.000Z",
    errorStateAt: "2020-05-01T12:00:00.000Z"

})


CREATE (egress3:EgressEndpoint {
    id: "egress3",
    name: "Power Consumption Analysis",
    description: "This is the third egress endpoint",
    connectionDetails: '{ "ID":"postman-pod1",
        "PROTOCOL":"MQTT",
        "PARAMETERS":{
            "HOST":"mqtt-broker-8341af19-8a7c-4a4f-b321-6cb7319e16c1",
            "PORT":"1883"
        },
        "TRANSMISSION_DETAILS":{
            "ORIGIN_TOPIC":"example",
            "FREQUENCY":"1",
            "TARGET":"exampleMQTT",
            "CHANGED_FREQUENCY":"1",
            "DOWN_SAMPLING_METHOD":"LATEST",
            "DATA_FORMAT": "WITH_METADATA",
            "METADATA": {
                "TIMESTAMP": false,
                "NAME": "postman",
                "FREQUENCY": 30
            }
        }}',
    frequency: 30,
    changedFrequency: 30,
    dataFormat: "WITH_METADATA",
    status: "ACTIVE",
    lastUpdatedAt: "2020-05-01T12:00:00.000Z",
    errorStateAt: "2020-05-01T12:00:00.000Z"

})

CREATE (egressVisual)-[:has]->(egress1)
CREATE (egressVisual)-[:has]->(egress2)
CREATE (egressAnalysis)-[:has]->(egress3)


CREATE (egress1)-[:accessTo]->(depth)

CREATE (egress2)-[:accessTo]->(temperature4)

CREATE (egress3)-[:accessTo]->(powerConsumption2)
