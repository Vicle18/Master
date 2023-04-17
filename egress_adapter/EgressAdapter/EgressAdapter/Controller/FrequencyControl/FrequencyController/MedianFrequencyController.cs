namespace EgressAdapter.Controller;

public class MedianFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new MedianFrequencyChanger();
    }
}