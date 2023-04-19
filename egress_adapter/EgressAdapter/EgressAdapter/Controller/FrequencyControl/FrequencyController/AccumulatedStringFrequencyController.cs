namespace EgressAdapter.Controller;

public class AccumulatedStringFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new AccumulatedStringFrequencyChanger();
    }
}