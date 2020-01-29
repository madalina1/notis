using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notis.Business.Entities
{
    public class Notary : Office
    {
        public bool IsSupportedForeignCitizens { get; set; }
    }
}
