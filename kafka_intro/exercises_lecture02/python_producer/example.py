from operator import truediv
from kafka import KafkaProducer
producer = KafkaProducer(bootstrap_servers='kafka1:9092')
exit = False
num = 0
while not exit:
    
    #msg = input("Enter a message: ")
    num += 1
    msg = str(num)
    if(input == "exit"):
        exit == True
        break
    producer.send('foobar', msg.encode('utf-8'))
    producer.flush()