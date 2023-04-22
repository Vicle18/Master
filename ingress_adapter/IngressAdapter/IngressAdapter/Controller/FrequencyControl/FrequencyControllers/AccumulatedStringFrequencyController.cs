using IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

namespace IngressAdapter.Controller.FrequencyControl.FrequencyControllers;

public class AccumulatedStringFrequencyController : EgressAdapter.Controller.FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new AccumulatedStringFrequencyChanger();
    }
}