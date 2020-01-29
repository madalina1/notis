using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using notis.Business.Entities;
using notis.Database;
using VDS.RDF.Query;

namespace notis.Business.Services
{
    public class NotaryService
    {
        private RDFRepository rdfRepository;

        private ServicesService servicesService;

        private SharedService sharedService;

        public NotaryService()
        {
            rdfRepository = new RDFRepository();
            servicesService = new ServicesService();
            sharedService = new SharedService();
        }

        public IEnumerable<Notary> GetAllNotaryOffices()
        {
            var notariesName = GetNotariesName();

            var resultList = new List<Notary>();

            foreach (var notaryName in notariesName)
            {
                var notary = GetNotary(notaryName);

                resultList.Add(notary);
            }

            return resultList;
        }

        public List<string> GetNotariesName()
        {
            var notaryNamesList = new List<string>();

            var resultss = rdfRepository.ProcessQuery("SELECT distinct ?s WHERE  { ?s rdf:type notis2:notaryPerson  }");
            if (resultss is SparqlResultSet)
            {
                SparqlResultSet rset = (SparqlResultSet)resultss;
                foreach (SparqlResult result in rset)
                {
                    var str = result.ToString();
                    var a = str.Substring(str.LastIndexOf('/') + 1);
                    notaryNamesList.Add(a);
                }
            }

            return notaryNamesList;
        }

        public Notary GetNotary(string name)
        {
            var notary = new Notary();
            notary.Address = new Address();

            var individ = (SparqlResultSet)rdfRepository.ProcessQuery("SELECT ?p ?o WHERE { notis2:" + name + " ?p ?o} order by ?p");

            SparqlResultSet rset = individ;
            foreach (SparqlResult result in rset)
            {
                var p = result[0].ToString();
                var pValue = p.Substring(p.LastIndexOf('/') + 1);

                var o = result[1].ToString();
                var oValue = o.Substring(o.LastIndexOf('/') + 1);

                switch (pValue)
                {
                    case "firstName":
                        {
                            notary.PersonName = oValue;
                            break;
                        }
                    case "lastName":
                        {
                            notary.PersonName = notary.PersonName + " " + oValue;
                            break;
                        }
                    case "phoneNo":
                        {
                            notary.PhoneNumber = oValue;
                            break;
                        }
                    case "isSupportedForeignCitizens":
                        {
                            notary.IsSupportedForeignCitizens = Int32.Parse(o.Substring(0, 1)) != 0;
                            break;
                        }
                    case "schedule":
                        {
                            notary.Schedule = sharedService.GetScheduleByString(oValue);
                            break;
                        }
                    case "address":
                        {
                            var address = (SparqlResultSet)rdfRepository.ProcessQuery("SELECT ?p ?o WHERE { schema:" + oValue + " ?p ?o} order by ?p");

                            foreach (SparqlResult addr in address)
                            {
                                var p2 = addr[0].ToString();
                                var pValue2 = p2.Substring(p2.LastIndexOf('/') + 1);

                                if (addr[1] == null)
                                {
                                    break;
                                }
                                var o2 = addr[1].ToString();
                                var oValue2 = o2.Substring(o2.LastIndexOf('/') + 1);

                                switch (pValue2)
                                {
                                    case "city":
                                        {
                                            notary.Address.City = oValue2;
                                            break;
                                        }
                                    case "locality":
                                        {
                                            notary.Address.Locality = oValue2;
                                            break;
                                        }
                                    case "street":
                                        {
                                            notary.Address.Street = oValue2;
                                            break;
                                        }
                                    case "coordinates":
                                    {
                                        notary.Address.Lat = sharedService.GetLatOrLong("lat", oValue2);
                                        notary.Address.Long = sharedService.GetLatOrLong("long", oValue2);
                                        break;
                                    }
                                }
                            }

                            break;
                        }
                }
            }

            notary.Services = servicesService.GetServiceForOffice(name);

            return notary;
        }

        public IEnumerable<Notary> GetNotaryOfficesByFilters(
            string city, 
            string typeOfService, 
            double? minPrice, 
            double? maxPrice,
            int? isSupportedForeignCitizens,
            int? startH, 
            int? endH, 
            string days)
        {
            isSupportedForeignCitizens = isSupportedForeignCitizens ?? 1;
            city = city ?? "IASI";
            typeOfService = typeOfService ?? "Contracte de ipoteca imobiliara";
            minPrice = 10;
            maxPrice = 110;
            days = "Mon,Fri,Sun";
            startH = 8;
            endH = 18;

            var notariesList = new List<Notary>();

            var query = "SELECT  distinct *" +
                        "WHERE { " +
                        "?person rdf:type notis2:notaryPerson." +
                        "?person ns1:firstName ?firstName." +
                        "?person ns1:lastName ?lastName." +
                        "?person ns1:isSupportedForeignCitizens ?isSupportedForeignCitizens ." +
                        "?address ns1:city ?city ." +
                        "?person notis2:hasServices notis2:" + typeOfService.Replace(" ", "_") + " ." +
                        "FILTER(?city = \"" + city + "\" && ?isSupportedForeignCitizens =" + isSupportedForeignCitizens + ")" + "}";

            var individ = (SparqlResultSet)rdfRepository.ProcessQuery(query);

            SparqlResultSet rset = individ;
            foreach (SparqlResult result in rset)
            {
                var notary = new Notary();
                var name = result.Value("firstName").ToString() +" "+ result.Value("lastName").ToString();
                notary = GetNotary(name.Replace(" ", "_"));

                var hasAtLeast1ServiceGoodPrice = false;
                foreach (var service in notary.Services)
                {
                    if (service != null)
                    {
                        if (minPrice < service.MaxPrice && minPrice.HasValue)
                        {
                            hasAtLeast1ServiceGoodPrice = true;
                        }
                        if (maxPrice > service.MaxPrice && maxPrice.HasValue)
                        {
                            hasAtLeast1ServiceGoodPrice = true;
                        }
                    }
                }

                var hasGoodSchedule = false;
                var schedule = notary.Schedule;
                var daysList = days ?? "Mon,Tue,Wed,Thu,Fri,Sat,Sun";
                foreach (var day in daysList.Split(',').ToList())
                {
                    switch (day)
                    {
                        case "Mon":
                        {
                            var startHour = schedule.Mon.StartH;
                            var endHour = schedule.Mon.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                        }
                        case "Tue":
                        {
                            var startHour = schedule.Tue.StartH;
                            var endHour = schedule.Tue.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                            }
                        case "Wed":
                        {
                            var startHour = schedule.Wed.StartH;
                            var endHour = schedule.Wed.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                            }
                        case "Thu":
                        {
                            var startHour = schedule.Thu.StartH;
                            var endHour = schedule.Thu.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                            }
                        case "Fri":
                        {
                            var startHour = schedule.Fri.StartH;
                            var endHour = schedule.Fri.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                            }
                        case "Sat":
                        {
                            var startHour = schedule.Sat.StartH;
                            var endHour = schedule.Sat.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                            }
                        case "Sun":
                        {
                            var startHour = schedule.Sun.StartH;
                            var endHour = schedule.Sun.EndH;

                            if (startH != null && startH < endHour)
                            {
                                hasGoodSchedule = true;
                            }
                            if (endH != null && endH > startHour)
                            {
                                hasGoodSchedule = true;
                            }

                            break;
                            }
                    }
                }
              

                if (hasAtLeast1ServiceGoodPrice && hasGoodSchedule)
                {
                    notariesList.Add(notary);
                }
            }

            return notariesList;
        }
    }
}
