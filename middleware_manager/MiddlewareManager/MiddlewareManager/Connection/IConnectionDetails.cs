namespace MiddlewareManager.Protocols;

public interface IConnectionDetails
{
    string ID { get; set; }
    string PROTOCOL { get; set; }
    object PARAMETERS { get; set; }
    TransmissionDetails TRANSMISSION_DETAILS { get; set; }
}