using IngressAdapter.Controller.FrequencyControl.FrequencyChanger;

namespace IngressAdapter.Controller.FrequencyControl.FrequencyControllers;

public class MedianFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new MedianFrequencyChanger();
    }
}