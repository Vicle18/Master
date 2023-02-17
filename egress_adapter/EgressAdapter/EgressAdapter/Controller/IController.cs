namespace EgressAdapter.Controller;

public interface IController
{
    public void Initialize();
    public void StartTransmission();
    public void Filter();
    public void Merging();
}