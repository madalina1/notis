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

        public TranslatorService()
        {
            rdfRepository = new RDFRepository();
            sharedService = new SharedService();
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
            var notary = new Translator();
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
                    case "authorisationNr":
                        {
                            notary.AuthorizedNumber = oValue;
                            break;
                        }
                    case "schedule":
                        {
                            notary.Schedule = sharedService.GetScheduleByString(oValue);
                            break;
                        }
                    case "languages":
                        {
                            notary.Languages = oValue
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
                                            notary.Address.City = oValue2;
                                            break;
                                        }
                                    case "courtOfAppeal":
                                        {
                                            notary.Address.CourtOfAppeal = oValue2;
                                            break;
                                        }
                                }
                            }

                            break;
                        }
                }
            }

//            notary.Services = servicesService.GetServiceForOffice(name);

            return notary;
        }
    }
}
