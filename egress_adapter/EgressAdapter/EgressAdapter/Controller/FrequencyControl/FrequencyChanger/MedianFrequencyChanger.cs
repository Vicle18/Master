namespace EgressAdapter.Controller;

public class MedianFrequencyChanger : IFrequencyChanger
{
    private List<string> _latestMessages;
    private bool _hasNewMessage;
    public MedianFrequencyChanger()
    {
        _latestMessages = new List<string>();
    }
    
    public void AddMessage(string msg)
    {
        _latestMessages.Add(msg);
        _hasNewMessage = true;
    }

    public bool HasMessage()
    {
        return _hasNewMessage;
    }

    public string GetMessage()
    {
        if (_hasNewMessage)
        {
            _hasNewMessage = false;
            var response = _latestMessages[(int) (_latestMessages.Count / 2) - 1];
            _latestMessages.Clear();
            return response;
        }
        throw new ArgumentException("No new messages");
    }
}