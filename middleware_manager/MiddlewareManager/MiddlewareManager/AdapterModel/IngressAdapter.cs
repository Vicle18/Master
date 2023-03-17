namespace MiddlewareManager.AdapterModel;

public struct IngressAdapter
{
    private string _Protocol;
    private Dictionary<string, string> _Parameters;

    public IngressAdapter(string protocol, Dictionary<string, string> parameters)
    {
        _Protocol = protocol;
        _Parameters = parameters;
    }

    public string ImageName
    {
        get { return _Protocol; }
        set { _Protocol = value; }
    }

    public Dictionary<string, string> EnvironmentVariables
    {
        get { return _Parameters; }
        set { _Parameters = value; }
    }
}