using System;
using System.Collections.Generic;

namespace Tulostaulu.Models
{
    public partial class Pelaajat
    {
        public long Tunnus { get; set; }
        public string Etunimi { get; set; }
        public string Sukunimi { get; set; }
        public long? Tasoitus { get; set; }
    }
}
