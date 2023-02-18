﻿using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace DataExplorer.BusCommunication.KAFKA
{
    /// <summary>
    /// Responsible for sending messages to one or more specified topics
    /// </summary>
    public interface IKafkaProducer
    {
        void ProduceMessage(string topic, string message);
    }
}