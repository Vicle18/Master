namespace MiddlewareManager.Protocols;

public interface IConnectionDetails
{
    string PROTOCOL { get; set; }
    object PARAMETERS { get; set; }
}