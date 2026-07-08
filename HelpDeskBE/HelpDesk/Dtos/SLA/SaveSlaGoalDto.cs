using System;

namespace HelpDesk.Dtos.SLA
{
    public class SaveSlaGoalDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public double GoalValue { get; set; }
    }
}
