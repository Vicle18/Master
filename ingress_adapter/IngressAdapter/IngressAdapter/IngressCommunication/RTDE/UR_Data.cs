/*

See :
https://www.universal-robots.com/how-tos-and-faqs/how-to/ur-how-tos/real-time-data-exchange-rtde-guide-22229/ 
 
BOOL : bool
UINT8 : byte
UINT32 : uint
UINT64 : ulong
INT32 : int
DOUBLE : double
VECTOR3D : double[]
VECTOR6D : double []
VECTOR6INT32 : int[]
VECTOR6UINT32 : uint[]
  
TODO and not TODO : do not declare public fields with other types & creates the array with the right size

*/
using System;

namespace Mycode
{

    [Serializable]
    public class UniversalRobot_Outputs
    {
       // public double io_current; // check the fields name in the RTDE guide : MUST be the same with the same type
        //public double[] actual_q = new double[6]; // array creation must be done here to give the size
        //public double[] target_q = new double[6]; // array creation must be done here to give the size

        //public int actual_q = new double[6];
       // public int robot_mode;
       //public sbyte recipe_id;

       public double timestamp;

       public int robot_mode;
       public int runtime_state;

       public double input_double_register_1;
       // free private & protected attributs are allows
       // all properties and methods also (even public)
       public override string ToString()
       {
           return $"{timestamp}, robotmode: {robot_mode}, output register:{input_double_register_1} , programstate: {runtime_state}";
       }
    }

    [Serializable]
    public class UniversalRobot_Inputs
    {
        //public byte tool_digital_output_mask;
        //public byte tool_digital_output;
        public double input_double_register_0;
        public double input_double_register_1;
        public double input_double_register_2;
        public double input_double_register_3;
        public double input_double_register_4;
        public double input_double_register_5;
        public int input_int_register_0;
        //public double input_double_register_24;
        
    }

}