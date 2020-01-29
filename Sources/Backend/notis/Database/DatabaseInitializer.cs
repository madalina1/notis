using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using VDS.RDF;
using VDS.RDF.Writing.Formatting;

namespace notis.Database
{
    public class DatabaseInitializer
    {
        public static string ontology = "C:\\Work\\RDF\\notis\\Database\\notis.owl";

        public static IGraph Initialize()
        {
            IGraph g = new Graph();

            g.LoadFromUri(new Uri("http://www.w3.org/1999/02/22-rdf-syntax-ns#"));

            if (!string.IsNullOrEmpty(ontology))
            {
                g.LoadFromFile(ontology);
            }
            else
            {
                var assembly = Assembly.GetExecutingAssembly();

                var test = assembly.GetManifestResourceNames();

                using (Stream stream = assembly.GetManifestResourceStream("Imor.Database.ImagesOntologyV1.owl"))

                using (StreamReader reader = new StreamReader(stream))
                {
                    string result = reader.ReadToEnd();

                    g.LoadFromString(result);
                }
            }

            foreach (var node in g.Nodes)
            {
                var a = node.ToString(new CsvFormatter());
            }

            return g;
        }
    }
}
