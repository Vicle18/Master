from opcua import ua, Server, Client
import json
import threading
from opcua.ua.uatypes import NodeId, NodeIdType
import signal
import sys
server = Server()


def signal_handler(sig, frame):
    server.stop()
    sys.exit(0)


def opcuaserver(name):
    # setup our server
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    server.set_endpoint("opc.tcp://0.0.0.0:8888")

    # setup our own namespace, not really necessary but should as spec
    uri = "sei4.sdu.dk"
    idx = server.register_namespace(uri)

    # get Objects node, this is where we should put our nodes
    objects = server.get_objects_node()

    # populating our address space
    myobj = objects.add_object("ns=2;s=::AsGlobalPV", "AsGlobalPV")

    myobj.add_variable("ns=6;s=::AsGlobalPV:LoadOnTrack",
                       "LoadOnTrack", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:WaitingCell1",
                       "WaitingCell1", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:MoveAssemblyPart",
                       "MoveAssemblyPart", 0).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:WaitingLoadOn",
                       "WaitingLoadOn", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:TaskCompleteCell1",
                       "TaskCompleteCell1", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:TaskCompleteCell2",
                       "TaskCompleteCell2", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:WaitingCell2",
                       "WaitingCell2", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:WaitingLoadOff",
                       "WaitingLoadOff", False).set_writable()
    myobj.add_variable("ns=6;s=::AsGlobalPV:LoadOffTrack",
                       "LoadOffTrack", False).set_writable()
    server.start()

opcuaserver("name")