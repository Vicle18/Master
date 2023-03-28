namespace IngressAdapter.IngressCommunication.RTDE
{
    public struct RtdeOutput
    {
        public string name;
        public string type;
        public override string ToString()
        {
            return $"Output with name: {name}, and type: {type}";
        }
    }
}