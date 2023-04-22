namespace EgressAdapter.Controller;

public interface IFrequencyChanger
{
    public void AddMessage(string msg);
    public bool HasMessage();
    public string GetMessage();
}