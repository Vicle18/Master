namespace IngressAdapter.IngressCommunication.RTDE;

public class RTDEConfiguration
{
    public string HOST { get; set; }
    public string PORT { get; set; }
    public string OUTPUT { get; set; }


    public override string ToString()
    {
        return $"Host: {HOST}, Port: {PORT}";
    }
}