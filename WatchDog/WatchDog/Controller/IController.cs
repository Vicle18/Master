namespace WatchDog.Controller;

public interface IController
{
    public Task Initialize();
    public void StartTransmission();
}