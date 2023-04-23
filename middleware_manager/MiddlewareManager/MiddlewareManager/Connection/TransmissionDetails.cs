using System.Text.Json;

namespace MiddlewareManager.Protocols;

public class TransmissionDetails
{
    public string FREQUENCY { get; set; }
    public string CHANGED_FREQUENCY { get; set; }
    public string? ORIGIN_TOPIC { get; set; }
    public string? TARGET_TOPIC { get; set; }

    public string? TARGET { get; set; }
    public string? DOWN_SAMPLING_METHOD { get; set; }
    public string DATA_FORMAT { get; set; }
    public string? DATA_TYPE { get; set; }

    public Dictionary<string, JsonElement>? METADATA { get; set; }
}