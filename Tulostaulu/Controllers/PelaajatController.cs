using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tulostaulu.Models;

namespace Tulostaulu.Controllers
{
    [Route("api/Pelaajat")]
    [ApiController]
    public class PelaajatController : ControllerBase
    {
        private readonly ViikkokisatContext _context;

        public PelaajatController(ViikkokisatContext context)
        {
            _context = context;
        }

        // GET: api/Pelaajat
        [HttpGet]
        public IEnumerable<Pelaajat> GetPelaajat()
        {
            return _context.Pelaajat;
        }

        // GET: api/Pelaajat
        [HttpGet("pelaaja/{tunnus}")]
        public List<Pelaajat> GetPelaaja(long tunnus)
        {
            var pelaaja = _context.Pelaajat.Where((t) =>
             t.Tunnus == tunnus).ToList();

            return pelaaja;
        }


        // GET: api/Pelaajat/nextid
        // Returns maximum value of id from database
        [HttpGet("nextid")]
        public long GetNextId()
        {
            if (!ModelState.IsValid)
            {
                return 0;
            }

            var pelaajat = _context.Pelaajat;
            long nextid = _context.Pelaajat.Max(i => i.Tunnus);

            if (nextid == 0)
            {
                return 1;
            }


            return nextid;
        }

        // PUT: api/Pelaajat/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPelaajat([FromRoute] long id, [FromBody] Pelaajat pelaajat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pelaajat.Tunnus)
            {
                return BadRequest();
            }

            _context.Entry(pelaajat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PelaajatExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Pelaajat
        [HttpPost]
        public async Task<IActionResult> PostPelaajat([FromBody] Pelaajat pelaajat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Pelaajat.Add(pelaajat);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PelaajatExists(pelaajat.Tunnus))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPelaajat", new { id = pelaajat.Tunnus }, pelaajat);
        }

        // DELETE: api/Pelaajat/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePelaajat([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pelaajat = await _context.Pelaajat.FindAsync(id);
            if (pelaajat == null)
            {
                return NotFound();
            }

            _context.Pelaajat.Remove(pelaajat);
            await _context.SaveChangesAsync();

            return Ok(pelaajat);
        }

        private bool PelaajatExists(long id)
        {
            return _context.Pelaajat.Any(e => e.Tunnus == id);
        }
    }
}