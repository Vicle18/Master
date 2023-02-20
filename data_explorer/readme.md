to run: 
docker run -p 8084:80 -e BUS_CONFIG__PARAMETERS__HOST=kafka1 -e BUS_CONFIG__PARAMETERS__PORT=9092 --network shared_network ex