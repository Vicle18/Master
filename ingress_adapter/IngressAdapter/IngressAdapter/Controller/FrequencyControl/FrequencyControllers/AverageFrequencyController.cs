using IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

namespace IngressAdapter.Controller.FrequencyControl.FrequencyControllers;

public class AverageFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new AverageFrequencyChanger();
    }
}