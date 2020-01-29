using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using notis.Business.Entities;
using notis.Business.Services;
using notis.Database;

namespace notis.Controllers
{
    [Route("api/translators")]
    [ApiController]
    public class TranslatorsController : ControllerBase
    {
        private TranslatorService translatorService;

        public TranslatorsController()
        {
            translatorService = new TranslatorService();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var result = translatorService.GetAllTranslatorOffices();

            return Ok(result);
        }
    }
}
