using IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

namespace IngressAdapter.Controller.FrequencyControl.FrequencyControllers;

public class AccumulatedStringFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new AccumulatedStringFrequencyChanger();
    }
}