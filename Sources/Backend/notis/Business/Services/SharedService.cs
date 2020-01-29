using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using notis.Business.Entities;
using Newtonsoft.Json.Linq;

namespace notis.Business.Services
{
    public class SharedService
    {
        public Schedule GetScheduleByString(string scheduleString)
        {
            var schedule = new Schedule();
            int i = 0;
            var days = JObject.Parse(scheduleString);
            foreach (var day in days)
            {
                var dayValue = day.Value.ToString();
                int? startH = null;
                int? endH = null;
                string specialHours = null;

                if (dayValue == "CLOSE")
                {
                    specialHours = dayValue;
                }
                else
                {
                    startH = Int32.Parse(day.Value["startH"].ToString());
                    endH = Int32.Parse(day.Value["endH"].ToString());
                }

                switch (day.Key.ToString())
                {
                    case "Mon":
                        schedule.Mon = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours};
                        break;
                    case "Tue":
                        schedule.Tue = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours };
                        break;
                    case "Wed":
                        schedule.Wed = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours };
                        break;
                    case "Thu":
                        schedule.Thu = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours };
                        break;
                    case "Fri":
                        schedule.Fri = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours };
                        break;
                    case "Sat":
                        schedule.Sat = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours };
                        break;
                    case "Sun":
                        schedule.Sun = new Hours() { StartH = startH, EndH = endH, SpecialHours = specialHours };
                        break;
                }
                i++;
            }

            return schedule;
        }

        public string GetLatOrLong(string coordin, string coordinatesString)
        {
            var coordinates = JObject.Parse(coordinatesString);

            foreach (var coord in coordinates)
            {
                if (coord.Key == coordin)
                {
                    return coord.Value.ToString();
                }
            }

            return null;
        }

        public string GetAddress(string longitude, string latitude)
        {
            longitude = "27.65790939";
            latitude = "47.12995076";

            var Address_ShortName = "";
            var Address_country = "";
            var Address_administrative_area_level_1 = "";
            var Address_administrative_area_level_2 = "";
            var Address_administrative_area_level_3 = "";
            var Address_colloquial_area = "";
            var Address_locality = "";
            var Address_sublocality = "";
            var Address_neighborhood = "";

            XmlDocument doc = new XmlDocument();

            try
            {
                doc.Load("http://maps.googleapis.com/maps/api/geocode/xml?latlng=" + latitude + "," + longitude + "&sensor=false");
                XmlNode element = doc.SelectSingleNode("//GeocodeResponse/status");
                if (element.InnerText == "ZERO_RESULTS")
                {
                    return ("No data available for the specified location");
                }
                else
                {

                    element = doc.SelectSingleNode("//GeocodeResponse/result/formatted_address");

                    string longname = "";
                    string shortname = "";
                    string typename = "";
                    bool fHit = false;


                    XmlNodeList xnList = doc.SelectNodes("//GeocodeResponse/result/address_component");
                    foreach (XmlNode xn in xnList)
                    {
                        try
                        {
                            longname = xn["long_name"].InnerText;
                            shortname = xn["short_name"].InnerText;
                            typename = xn["type"].InnerText;


                            fHit = true;
                            switch (typename)
                            {
                                //Add whatever you are looking for below
                                case "country":
                                    {
                                        Address_country = longname;
                                        Address_ShortName = shortname;
                                        break;
                                    }

                                case "locality":
                                    {
                                        Address_locality = longname;
                                        //Address_locality = shortname; //Om Longname visar sig innehålla konstigheter kan man använda shortname istället
                                        break;
                                    }

                                case "sublocality":
                                    {
                                        Address_sublocality = longname;
                                        break;
                                    }

                                case "neighborhood":
                                    {
                                        Address_neighborhood = longname;
                                        break;
                                    }

                                case "colloquial_area":
                                    {
                                        Address_colloquial_area = longname;
                                        break;
                                    }

                                case "administrative_area_level_1":
                                    {
                                        Address_administrative_area_level_1 = longname;
                                        break;
                                    }

                                case "administrative_area_level_2":
                                    {
                                        Address_administrative_area_level_2 = longname;
                                        break;
                                    }

                                case "administrative_area_level_3":
                                    {
                                        Address_administrative_area_level_3 = longname;
                                        break;
                                    }

                                default:
                                    fHit = false;
                                    break;
                            }


                            if (fHit)
                            {
                                Console.Write(typename);
                                Console.ForegroundColor = ConsoleColor.Green;
                                Console.Write("\tL: " + longname + "\tS:" + shortname + "\r\n");
                                Console.ForegroundColor = ConsoleColor.Gray;
                            }
                        }

                        catch (Exception e)
                        {
                            //Node missing either, longname, shortname or typename
                            fHit = false;
                            Console.Write(" Invalid data: ");
                            Console.ForegroundColor = ConsoleColor.Red;
                            Console.Write("\tX: " + xn.InnerXml + "\r\n");
                            Console.ForegroundColor = ConsoleColor.Gray;
                        }


                    }

                    //Console.ReadKey();
                    return (element.InnerText);
                }

            }
            catch (Exception ex)
            {
                return ("(Address lookup failed: ) " + ex.Message);
            }
        }
    
    }
}
