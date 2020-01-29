using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notis.Business.Entities
{
    public class Translator : Office
    {
        public List<string> Languages { get; set; }

        public string AuthorizedNumber { get; set; }
    }
}
