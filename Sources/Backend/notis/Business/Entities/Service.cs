using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notis.Business.Entities
{
    public class Service
    {
        public string ServiceName { get; set; }

        public double MinPrice { get; set; }

        public double MaxPrice { get; set; }

        public List<string> NecessaryPapers { get; set; }
    }
}
