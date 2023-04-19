namespace EgressAdapter.Controller;

public class LatestFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new LatestFrequencyChanger();
    }
}