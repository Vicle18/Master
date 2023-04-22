using IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

namespace IngressAdapter.Controller.FrequencyControl.FrequencyControllers;

public class LatestFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new LatestFrequencyChanger();
    }
}