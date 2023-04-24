namespace IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

public class AccumulatedStringFrequencyChanger : IFrequencyChanger
{
    private bool _hasNewMessage = false;

    public string _accumulatedString = "";
    public void AddMessage(string msg)
    {
        _accumulatedString = $"{_accumulatedString}, {msg}";
        _hasNewMessage = true;
    }

    public bool HasMessage()
    {
        return _hasNewMessage;
    }

    public string GetMessage()
    {
        _hasNewMessage = false;
        var response = _accumulatedString;
        _accumulatedString = "";
        return response;
    }
}