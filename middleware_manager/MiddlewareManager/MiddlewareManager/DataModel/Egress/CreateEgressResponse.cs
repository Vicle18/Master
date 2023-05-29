namespace MiddlewareManager.DataModel;

public class CreateEgressResponse
{
    public CreateEgressEndpoints createEgressEndpoints { get; set; }
}

public class CreateEgressEndpoints
{
    public List<EgressEndpoint> egressEndpoints { get; set; }

}

public class EgressEndpoint
{
    public string id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string dataFormat { get; set; }

    public int frequency { get; set; }

    public string connectionDetails { get; set; }

    public int changedFrequency { get; set; }


}