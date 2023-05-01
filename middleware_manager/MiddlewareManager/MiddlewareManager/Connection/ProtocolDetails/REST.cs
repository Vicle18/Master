using MiddlewareManager.DataModel;

namespace MiddlewareManager.Protocols;

public static class REST
{
    public static IConnectionDetails CreateRESTIngressConnection(string id, IngressDTOBase value, TransmissionDetails transmissionDetails)
    {
        return new RESTConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = new ParameterDetails
            {
                SERVER_URL = value.serverUrl,
            },
            TRANSMISSION_DETAILS = transmissionDetails
        };
    }

    public static IConnectionDetails CreateRESTEgressConnection(string id, CreateEgressDto value,
        TransmissionDetails transmissionDetails)
    {
        return new RESTConnectionDetails
        {
            ID = id,
            PROTOCOL = value.protocol,
            PARAMETERS = new ParameterDetails
            {
                SERVER_URL = value.serverUrl ?? DetailsGenerator.GenerateServerUrl(),
            },
            TRANSMISSION_DETAILS = transmissionDetails
        };
    }
}