using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using notis.Business.Entities;
using notis.Database;
using VDS.RDF.Query;

namespace notis.Business.Services
{
    public class TranslatorService
    {
        private RDFRepository rdfRepository;

        private SharedService sharedService;

        private ServicesService servicesService;

        public TranslatorService()
        {
            rdfRepository = new RDFRepository();
            sharedService = new SharedService();
            servicesService = new ServicesService();
        }

        public IEnumerable<Translator> GetAllTranslatorOffices()
        {
            var translatorsName = GetTranslatorsName();

            var resultList = new List<Translator>();

            foreach (var translatorName in translatorsName)
            {
                var notary = GetTranslator(translatorName);

                resultList.Add(notary);
            }

            return resultList;
        }

        public List<string> GetTranslatorsName()
        {
            var translatorsNamesList = new List<string>();

            var resultss = rdfRepository.ProcessQuery("SELECT distinct ?s WHERE  { ?s rdf:type notis2:translator  }");
            if (resultss is SparqlResultSet)
            {
                SparqlResultSet rset = (SparqlResultSet)resultss;
                foreach (SparqlResult result in rset)
                {
                    var str = result.ToString();
                    var a = str.Substring(str.LastIndexOf('/') + 1);
                    translatorsNamesList.Add(a);
                }
            }

            return translatorsNamesList;
        }

        public Translator GetTranslator(string name)
        {
            var translator = new Translator();
            translator.Address = new Address();

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
                            translator.PersonName = oValue;
                            break;
                        }
                    case "lastName":
                        {
                            translator.PersonName = translator.PersonName + " " + oValue;
                            break;
                        }
                    case "phoneNo":
                        {
                            translator.PhoneNumber = oValue;
                            break;
                        }
                    case "authorisationNr":
                        {
                            translator.AuthorizedNumber = oValue;
                            break;
                        }
                    case "schedule":
                        {
                            translator.Schedule = sharedService.GetScheduleByString(oValue);
                            break;
                        }
                    case "languages":
                        {
                            translator.Languages = oValue
                                .Replace("\'", "")
                                .Replace("[", "")
                                .Replace("]", "")
                                .Split(", ").ToList();
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
                                            translator.Address.City = oValue2;
                                            break;
                                        }
                                    case "courtOfAppeal":
                                        {
                                            translator.Address.CourtOfAppeal = oValue2;
                                            break;
                                        }
                                    case "coordinates":
                                    {
                                        translator.Address.Lat = sharedService.GetLatOrLong("lat", oValue2);
                                        translator.Address.Long = sharedService.GetLatOrLong("long", oValue2);
                                        break;
                                        }
                                }
                            }

                            break;
                        }
                }
            }

            translator.Services = servicesService.GetServiceForOffice("translation", name);

            return translator;
        }

        public object GetTranslatorsOfficesByFilters(
            string city, 
            string typeOfService, 
            double? minPrice, 
            double? maxPrice,
            int? startH, 
            int? endH, 
            string days)
        {
            city = "IASI";
            typeOfService = typeOfService ?? "Medical_documents";
            minPrice = minPrice ?? 10;
            maxPrice = maxPrice ?? 610;
            days = days ?? "Mon,Tue,Wed,Thu,Fri,Sat,Sun";
            startH = startH ?? 7;
            endH = endH ?? 18;

            var translatorsList = new List<Translator>();

            var query = "";

            if (!string.IsNullOrEmpty(typeOfService))
            {
                query = "SELECT  distinct *" +
                        "WHERE { " +
                        "?person rdf:type notis2:translator." +
                        "?person ns1:firstName ?firstName." +
                        "?person ns1:lastName ?lastName." +
                        "?person ns1:address ?address ." +
                        "?address ns1:city ?city ." +
                        "?person notis2:hasServices notis2:" + typeOfService.Replace(" ", "_") + " ." +
                        "FILTER(?city = \"" + city + "\")" + "}";
            }
            else
            {
                query = "SELECT  distinct *" +
                        "WHERE { " +
                        "?person rdf:type notis2:translator." +
                        "?person ns1:firstName ?firstName." +
                        "?person ns1:lastName ?lastName." +
                        "?person ns1:address ?address ." +
                        "?address ns1:city ?city ." +
                        "FILTER(?city = \"" + city + "\")" + "}";
            }
           

            var individ = (SparqlResultSet)rdfRepository.ProcessQuery(query);

            SparqlResultSet rset = individ;
            foreach (SparqlResult result in rset)
            {
                var notary = new Translator();
                var name = result.Value("firstName").ToString() + " " + result.Value("lastName").ToString();
                notary = GetTranslator(name.Replace(" ", "_"));

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
                    translatorsList.Add(notary);
                }
            }

            return translatorsList;
        }
    }
}
