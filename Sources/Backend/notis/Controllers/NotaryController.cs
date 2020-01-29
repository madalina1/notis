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
    [Route("api/notaries")]
    [ApiController]
    public class NotaryController : ControllerBase
    {
        private NotaryService notaryService;

        public NotaryController()
        {
            notaryService = new NotaryService();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var result = notaryService.GetAllNotaryOffices();

            return Ok(result);
        }

        [HttpGet]
        [Route("filters")]
        public IActionResult GetNotariesByFilters(
            string city, 
            string typeOfService, 
            double? minPrice, 
            double? maxPrice, 
            int? isSupportedForeignCitizens,
            int? startH,
            int? endH,
            string days)
        {
            var result = notaryService.GetNotaryOfficesByFilters(
                city, 
                typeOfService, 
                minPrice, 
                maxPrice, 
                isSupportedForeignCitizens, 
                startH, 
                endH, 
                days);

            return Ok(result);
        }
    }
}
