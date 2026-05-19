using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDesk.Database.Entities
{
    public abstract class BaseEntity
    {
        // Ids
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // Creado por
        [Column("created_by")]
        public long CreatedBy { get; set; }

        // Fecha creación
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        // Actualizado por
        [Column("updated_by")]
        public long? UpdatedBy { get; set; }

        // Fecha actualización
        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }
    }
}
