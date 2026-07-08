using System;

namespace HelpDesk.Dtos.SLA
{
    public class SlaGoalDto
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public double GoalValue { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
