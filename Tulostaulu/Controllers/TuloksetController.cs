using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Tulostaulu.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tulostaulu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TuloksetController : Controller
    {

        public static List<JObject> _LahtoJarjestys { set; get; }

        public class tiedot
        {
            public long Tunnus { get; set; }
            public long K1 { get; set; }
            public long K2 { get; set; }
            public long Tasoitus { get; set; }
            public long Mukana { get; set; }      // Päivitettävä kenttä, 1 = K1, 2= K2, 4 = Tasoitus
        }

        // GET: api/<controller>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/mukana/paiva
        [HttpGet("mukana/{peliPaiva}")]
        public List<Tulokset> GetMukana(string peliPaiva)
        {
            ViikkokisatContext context = new ViikkokisatContext();

            var pelissa = context.Tulokset.Where((t) =>
             t.Paiva == peliPaiva ).ToList();
            if (pelissa.Count == 0)
            {
                System.Diagnostics.Debug.WriteLine("Viikkokilpailua ei löytynyt");
                return new List<Tulokset>();
            }

            return pelissa;
        }

        // GET api/<controller>/mukana/paiva
        [HttpGet("v2/mukana/{peliPaiva}")]
        public List<JObject> GetPelissa(string peliPaiva)
        {
            ViikkokisatContext context = new ViikkokisatContext();

            var pelissa = context.Tulokset.Where((t) =>
             t.Paiva == peliPaiva).ToList();
            if (pelissa.Count == 0)
            {
                System.Diagnostics.Debug.WriteLine("Viikkokilpailua ei löytynyt");
                return new List<JObject>();
            }

            // New list of JSON objects which contains tulokset where pelaaja id is changed to real name
            dynamic tulosLista = new List<JObject>();

            foreach (Tulokset pelaaja in pelissa) {

                dynamic extTulokset = new JObject();

                var nimi = context.Pelaajat.Where((t) =>
                 t.Tunnus == pelaaja.PelaajaTunnus).ToList();
                if (nimi.Count == 0)
                {
                    System.Diagnostics.Debug.WriteLine("Viikkokilpailua ei löytynyt");
                    nimi[0].Etunimi = "Ei";
                    nimi[0].Sukunimi = "Löytynyt";
                }

                extTulokset.Tunnus = pelaaja.Tunnus;
                extTulokset.K1 = pelaaja.K1;
                extTulokset.K2 = pelaaja.K2;
                extTulokset.Tasoitus = pelaaja.Tasoitus;
                extTulokset.Nimi = nimi[0].Etunimi + " " + nimi[0].Sukunimi;

                tulosLista.Add(extTulokset);
            };

            return tulosLista;
        }

        // GET api/<controller>/koe/id
        [HttpGet("koe/{id}")]
        public string GetKoe(long id)
        {
            ViikkokisatContext context = new ViikkokisatContext();

            var pelissa = context.Pelaajat.Where((t) =>
             t.Tunnus == id).ToList();
            if (pelissa.Count == 0)
            {
                System.Diagnostics.Debug.WriteLine("Viikkokilpailua ei löytynyt");
                return " ";
            }

            return pelissa[0].Etunimi + " " + pelissa[0].Sukunimi;
        }

        // POST api/tulokset/lahtojarjestys
        [HttpGet("lahtojarjestys")]
        public List<JObject> GetLahtojarjestys()
        {
            if (_LahtoJarjestys == null || _LahtoJarjestys.Count == 0)
            {
                return new List<JObject>();
            }

            return _LahtoJarjestys;
        }

        // POST api/tulokset/lahtojarjestys
        [HttpPost ("lahtojarjestys")]
        public IActionResult PostLahtojarjestys ([FromBody] List<JObject>jarjestys)
        {
            _LahtoJarjestys = jarjestys;

            return Ok(_LahtoJarjestys.Count );
        }


        // POST api/tulokset/lisaarivi
        [HttpPost ("lisaarivi")]
        public async Task<IActionResult> Post([FromBody] List<Tulokset> tulokset)
        {
            ViikkokisatContext context = new ViikkokisatContext();

            //System.Diagnostics.Debug.WriteLine("Yrittämässä tallentaa");

            foreach (Tulokset tulosrivi in tulokset)
            {
                long nextid = context.Tulokset.Max(i => i.Tunnus);
                tulosrivi.Tunnus = nextid + 1;

                var loytyi = context.Tulokset.Where((t) =>
                             t.Paiva == tulosrivi.Paiva && t.PelaajaTunnus == tulosrivi.PelaajaTunnus).ToList();
                if (loytyi.Count != 0)
                {
                    System.Diagnostics.Debug.WriteLine("Peluri on jo kannassa");
                    continue;
                }

                context.Add(tulosrivi);
                try
                {
                    context.SaveChanges();
                }
                catch (DbUpdateException)
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                catch (SqliteException ex)
                {
                    var error = new
                    {
                        message = "Database locked",
                        status = StatusCodes.Status500InternalServerError
                    };
                    Response.StatusCode = error.status;
                    return new ObjectResult(error);
                }
            }
            return Ok(); 
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // PUT api/tulokset/paivita
        [HttpPut("paivita")]
        public IActionResult PutTulos ([FromBody] tiedot tulos)
        {
            ViikkokisatContext context = new ViikkokisatContext();
            string ominaisuus = "";

            var uusitulos = new Tulokset { Tunnus = tulos.Tunnus };
            if (tulos.Mukana == 1)
            {
                uusitulos.K1 = tulos.K1;
                ominaisuus = "K1";
            }
            else if (tulos.Mukana == 2)
            {
                uusitulos.K2 = tulos.K2;
                ominaisuus = "K2";
            }
            else if (tulos.Mukana == 4)
            {
                uusitulos.Tasoitus = tulos.Tasoitus;
                ominaisuus = "Tasoitus";
            }
            else
            {
                return NotFound();
            }

            context.Entry(uusitulos).Property(ominaisuus).IsModified = true;
            context.SaveChanges();

            return Ok();
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
