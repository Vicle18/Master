using Serilog;

namespace IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

public class AverageFrequencyChanger  : IFrequencyChanger
{
    private float _accumulatedValue = 0;
    private float _messageCounter = 0;
    private bool _hasNewMessage = false;

    public void AddMessage(string msg)
    {
        try
        {
            Log.Debug("Adding message in Average, now {value},  {count}, has new message: {has}", _accumulatedValue, _messageCounter, _hasNewMessage);
            _accumulatedValue += Int32.Parse(msg);
            _messageCounter++;
            _hasNewMessage = true;
        }
        catch (FormatException e)
        {
            Log.Error("Could not transform message {msg} to int" ,msg);
        }
        
    }

    public bool HasMessage()
    {
        return _hasNewMessage;
    }

    public string GetMessage()
    {
        
        _hasNewMessage = false;
        var value = _accumulatedValue / _messageCounter;
        _accumulatedValue = _messageCounter = 0;
        Log.Debug("Extractinv message from average {msg}", value.ToString());
        return value.ToString();
    }
}