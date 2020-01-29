using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notis.Business.Entities
{
    public class Office
    {
        public List<Service> Services { get; set; }

        public string PersonName { get; set; }

        public string PhoneNumber { get; set; }

        public Schedule Schedule { get; set; }

        public Address Address { get; set; }
    }

    public class Address
    {
        public string City { get; set; }

        public string Locality { get; set; }

        public string Lat { get; set; }

        public string Long { get; set; }

        public string Street { get; set; }

        public string CourtOfAppeal { get; set; }
    }

    public class Schedule
    {
        public Hours Mon { get; set; }
        public Hours Tue { get; set; }
        public Hours Wed { get; set; }
        public Hours Thu { get; set; }
        public Hours Fri { get; set; }
        public Hours Sat { get; set; }
        public Hours Sun { get; set; }
    }

    public class Hours
    {
        public int? StartH { get; set; }

        public int? EndH { get; set; }

        public string SpecialHours { get; set; }
    }
}
