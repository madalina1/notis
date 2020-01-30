using System;
using System.Collections.Generic;
using System.Linq;
using notis.Business.Entities;
using notis.Database;
using VDS.RDF.Query;

namespace notis.Business.Services
{
    public class ServicesService
    {
        private RDFRepository rdfRepository;

        public ServicesService()
        {
            rdfRepository = new RDFRepository();
        }

        public List<Service> GetServiceForOffice(string officeType, string name)
        {
            var serviceList = new List<Service>();

            var notary = new Notary();
            notary.Address = new Address();

            var allServices = GetAllServices(officeType);

            var services = (SparqlResultSet)rdfRepository.ProcessQuery("SELECT ?o WHERE { notis2:" + name + " notis2:hasServices ?o} ");
            SparqlResultSet rset = (SparqlResultSet)services;
            foreach (SparqlResult result in rset)
            {
                var str = result.ToString();
                var serviceName = str.Substring(str.LastIndexOf('/') + 1);

                serviceList.Add(allServices.Find(x => x.ServiceName == serviceName));
            }

            return serviceList;
        }

        public Service GetServiceByName(string officeType, string name)
        {
            var service = GetAllServices(officeType).Find(x => x.ServiceName == name);

            return service;
        }

        public List<Service> GetAllServices(string officeType)
        {
            var serviceList = new List<Service>();

            var services = (SparqlResultSet)rdfRepository.ProcessQuery("SELECT ?s WHERE { ?s rdf:type notis2:"+ officeType + "-type-of-service}");
            SparqlResultSet rset = (SparqlResultSet)services;
            foreach (SparqlResult result in rset)
            {
                var str = result.ToString();
                var serviceName = str.Substring(str.LastIndexOf('/') + 1);

                var service = new Service();
                service.ServiceName = serviceName;
                service.NecessaryPapers = GetNecessaryPapers(serviceName);

                var random = new Random();
                service.MinPrice = Math.Round(random.NextDouble() * (400.0 - 10.0) + 10.0, 2);
                service.MaxPrice = Math.Round(service.MinPrice + 50.5, 2);

                serviceList.Add(service);
            }

            return serviceList;
        }

        public List<string> GetAllNecessaryPapers()
        {
            var papersList = new List<string>();

            var notary = new Notary();
            notary.Address = new Address();

            var services = (SparqlResultSet)rdfRepository.ProcessQuery("SELECT * WHERE { ?s rdf:type notis2:necessary-papers}");
            SparqlResultSet rset = (SparqlResultSet)services;
            foreach (SparqlResult result in rset)
            {
                var str = result.ToString();
                var papers = str.Substring(str.LastIndexOf('/') + 1);

                papersList.Add(papers);
            }

            return papersList;
        }

        public List<string> GetNecessaryPapers(string serviceName)
        {
            var papersList = new List<string>();

            var notary = new Notary();
            notary.Address = new Address();

            var services = (SparqlResultSet)rdfRepository.ProcessQuery("SELECT ?o WHERE { notis2:" + serviceName + " notis2:needs ?o}");
            SparqlResultSet rset = (SparqlResultSet)services;
            foreach (SparqlResult result in rset)
            {
                var str = result.ToString();
                var papers = str.Substring(str.LastIndexOf('/') + 1);

                papersList.Add(papers);
            }

            return papersList;
        }
    }
}
