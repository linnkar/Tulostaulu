using System;
using System.Collections.Generic;

namespace Tulostaulu.Models
{
    public partial class Tulokset
    {
        public long Tunnus { get; set; }
        public long PelaajaTunnus { get; set; }
        public string Paiva { get; set; }
        public long K1 { get; set; }
        public long K2 { get; set; }
        public long Tasoitus { get; set; }
    }
}
