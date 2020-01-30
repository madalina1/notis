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

        [HttpGet]
        [Route("filters")]
        public IActionResult GetTranslatorsByFilters(
            string city,
            string typeOfService,
            double? minPrice,
            double? maxPrice,
            int? isSupportedForeignCitizens,
            int? startH,
            int? endH,
            string days)
        {
            var result = translatorService.GetTranslatorsOfficesByFilters(
                city,
                typeOfService,
                minPrice,
                maxPrice,
                startH,
                endH,
                days);

            return Ok(result);
        }
    }
}
