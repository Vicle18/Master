using Serilog;

namespace IngressAdapter.Controller.FrequencyControl;

public abstract class FrequencyController
{
    public IFrequencyChanger frequencyChanger;
    public CancellationTokenSource cts = new CancellationTokenSource();

    public FrequencyController()
    {
        frequencyChanger = CreateFrequencyChanger();
    }

    public void AddMessage(string msg)
    {
        Log.Debug("new message controller");
        frequencyChanger.AddMessage(msg);
    }
    
    
    public async Task StartTransmission(float changedFrequency, Action< string> messageHandler)
    {
        
        var task = Task.Run(async() =>
        {
            try
            {
                while (!cts.Token.IsCancellationRequested)
                {
                    if (frequencyChanger.HasMessage())
                    {
                        Log.Debug("sending message, waiting for {time} ms with frequency {freq}", 1000 / changedFrequency, changedFrequency);
                        messageHandler(frequencyChanger.GetMessage());

                        Log.Debug("{time} waiting", "starting");
                        await Task.Delay((int) (1000 / changedFrequency));
                        Log.Debug("{time} waiting", "finished");

                    }
                    // this could potentially use a lot of resources..
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }, CancellationToken.None);
    }

    public void StopTransmission()
    {
        cts.Cancel();
    }

    public abstract IFrequencyChanger CreateFrequencyChanger();
}