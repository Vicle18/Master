namespace IngressAdapter.Controller.FrequencyControl.FrequencyControllers;

public class LatestFrequencyController : EgressAdapter.Controller.FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new LatestFrequencyChanger();
    }
}