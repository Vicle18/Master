namespace IngressAdapter.Controller.FrequencyControl.FrequencyChanger;
public class LatestFrequencyChanger : IFrequencyChanger
{
    private string _latestMessage;
    private bool _hasNewMessage;
    public LatestFrequencyChanger()
    {
        _latestMessage = "";
    }
    public void AddMessage(string msg)
    {
        _latestMessage = msg;
        _hasNewMessage = true;
    }

    public bool HasMessage()
    {
        return _hasNewMessage;
    }

    public string GetMessage()
    {
        _hasNewMessage = false;
        return _latestMessage;
    }
}