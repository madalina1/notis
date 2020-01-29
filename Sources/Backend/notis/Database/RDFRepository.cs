using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using notis.Business;
using notis.Business.Entities;
using VDS.RDF;
using VDS.RDF.Nodes;
using VDS.RDF.Ontology;
using VDS.RDF.Parsing;
using VDS.RDF.Query;
using VDS.RDF.Query.Builder;
using VDS.RDF.Query.Datasets;
using VDS.RDF.Writing.Formatting;

namespace notis.Database
{
    public class RDFRepository
    {
        private readonly IGraph graph;

        public RDFRepository()
        {
            graph = DatabaseInitializer.Initialize();
        }

        public object ProcessQuery(string query)
        {
            SparqlParameterizedString queryString = new SparqlParameterizedString();
            SparqlQueryParser parser = new SparqlQueryParser();

            queryString.Namespaces.AddNamespace("rdf", new Uri("http://www.w3.org/1999/02/22-rdf-syntax-ns#"));
            queryString.Namespaces.AddNamespace("owl", new Uri("http://www.w3.org/2002/07/owl#"));
            queryString.Namespaces.AddNamespace("rdfs", new Uri("http://www.w3.org/2000/01/rdf-schema#"));
            queryString.Namespaces.AddNamespace("notis", new Uri("http://www.semanticweb.org/notis#"));
            queryString.Namespaces.AddNamespace("notis2", new Uri("http://www.semanticweb.org/notis/"));
            queryString.Namespaces.AddNamespace("ns1", new Uri("http://xmlns.com/foaf/0.1/"));
            queryString.Namespaces.AddNamespace("schema", new Uri("http://schema.org/address/"));

            queryString.CommandText = query;

            SparqlQuery queryy = parser.ParseFromString(queryString);

            TripleStore store = new TripleStore();
            store.Add(graph);

            InMemoryDataset ds = new InMemoryDataset(store, true);
            ISparqlQueryProcessor processor = new LeviathanQueryProcessor(ds);

            return processor.ProcessQuery(queryy);
        }
    }
}
