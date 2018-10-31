using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Tulostaulu.Models
{
    public partial class ViikkokisatContext : DbContext
    {
        public ViikkokisatContext()
        {
        }

        public ViikkokisatContext(DbContextOptions<ViikkokisatContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Pelaajat> Pelaajat { get; set; }
        public virtual DbSet<Tulokset> Tulokset { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlite("Datasource=C:\\Users\\X220\\source\\repos\\Tulostaulu\\Tulostaulu\\Viikkokisat.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pelaajat>(entity =>
            {
                entity.HasKey(e => e.Tunnus);

                entity.HasIndex(e => e.Tunnus)
                    .IsUnique();

                entity.Property(e => e.Tunnus).ValueGeneratedNever();
            });

            modelBuilder.Entity<Tulokset>(entity =>
            {
                entity.HasKey(e => e.Tunnus);

                entity.HasIndex(e => e.Tunnus)
                    .IsUnique();

                entity.Property(e => e.Tunnus).ValueGeneratedNever();

                entity.Property(e => e.Paiva).IsRequired();
            });
        }
    }
}
