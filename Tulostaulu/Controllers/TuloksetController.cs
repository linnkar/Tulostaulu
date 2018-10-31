using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Tulostaulu.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tulostaulu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TuloksetController : Controller
    {
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

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
