namespace EgressAdapter.Controller;

public class AverageFrequencyController : FrequencyController
{
    public override IFrequencyChanger CreateFrequencyChanger()
    {
        return new AverageFrequencyChanger();
    }
}