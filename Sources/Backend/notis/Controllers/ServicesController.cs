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
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private ServicesService servicesService;
        private SharedService sharedService;

        public ServicesController()
        {
            servicesService = new ServicesService();
            sharedService = new SharedService();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var result = servicesService.GetAllServices();

            return Ok(result);
        }

        [HttpGet]
        [Route("necessaryPapers")]
        public IActionResult GetPapers()
        {
            var result = servicesService.GetAllNecessaryPapers();

            return Ok(result);
        }

        [HttpGet]
        [Route("{serviceName}/necessaryPapers")]
        public IActionResult GetPapers(string serviceName)
        {
            var result = servicesService.GetNecessaryPapers(serviceName);

            return Ok(result);
        }

        [HttpGet]
        [Route("address")]
        public IActionResult GetAddress()
        {
            var result = sharedService.GetAddress("s", "s");

            return Ok(result);
        }
    }
}
