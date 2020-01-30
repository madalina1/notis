import pandas as pd
import random
from unidecode import unidecode
from rdflib import Graph, URIRef, BNode, Literal, Namespace
from random import randint
from rdflib.namespace import RDF, FOAF

def read_translators():
    list_of_translators = []
    dfs = pd.read_excel("traducatori.xlsx")

    coordinatesList = [
    {"lat":47.17396962, "long":27.56250858},
    {"lat":47.17577834, "long":27.58430958},
    {"lat":47.17239558, "long":27.54173756},
    {"lat":47.17680397, "long":27.5510931},
    {"lat":47.18366256, "long":27.56525517},
    {"lat":47.1765706, "long":27.57787228},
    {"lat":47.17324509, "long":27.56748676},
    {"lat":47.17980397, "long":27.4982214},
    {"lat":47.17292886, "long":27.48165607},
    {"lat":47.14527796, "long":27.53753185},
    {"lat":47.12386303, "long":27.55710125},
    {"lat":47.15570399, "long":27.68949509},
    ]

    for index, row in dfs.iterrows():
        lastNameFirstName = row["Nume si prenume"].split(" ");
        lastName = lastNameFirstName[0]
        firstName = ' '.join(lastNameFirstName[1:]).strip()
        court_of_Appeal = row["Curtea de Apel"]
        languages = row["Limbi"].replace(" ","").split(",")
        city = row["judet"]
        phoneNo = editPhoneNumber(row["Telefon"])
        authorisationNo = row["Numar autorizatie"]
        
        startHourList = [8,9,10,11,12]
        endHourList = [15, 16, 17, 18, 19]
        schedule = {
            "Mon":
            {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            },
             "Tue":
            {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            },
             "Wed":
            {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            },
             "Thu":
            {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            },
            "Fri": random.choice(["CLOSE", {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            }]),
            "Sat": random.choice(["CLOSE", {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            }]),
            "Sun": random.choice(["CLOSE", {
                "startH":random.choice(startHourList),
                "endH":random.choice(endHourList)
            }])
        }

        if(index < 12):
            coordinates = coordinatesList.pop()
        else:
            coordinates = {"lat":47.12995076, "long":27.65790939}

        translator = {
            "lastName": lastName,
            "firstName": firstName,
            "phoneNo": phoneNo,
            "city": city,
            "court_of_appeal": court_of_Appeal,
            "languages": languages,
            "authorisation_no":str(authorisationNo),
            "schedule": schedule,
            "coordinates":coordinates
        }
        list_of_translators.append(translator)
    return list_of_translators

def editPhoneNumber(phoneNo):
    phoneNo = str(phoneNo)
    if(len(phoneNo) == 0):
        return "074" + str(random_with_N_digits(7))
    else:
        phoneNo = phoneNo.replace(" ","").replace("/","").replace(".","")
        if len(phoneNo)>=10:
            return  phoneNo[:10]
        else:
            return "074" + str(random_with_N_digits(7))
def random_with_N_digits(n):
        range_start = 10 ** (n - 1)
        range_end = (10 ** n) - 1
        return randint(range_start, range_end)

def createRDF(list_of_translators):

    translatorClass = URIRef("https://www.merriam-webster.com/dictionary/translator")
    # addressClass = URIRef("https://dictionary.cambridge.org/dictionary/english/address")
    gg = Graph()
    gg.add((translatorClass, RDF.type, FOAF.Person))


    for i in range(10):
        translator = list_of_translators[i]
        identificator = str(translator["firstName"] + "_" + translator["lastName"]).replace(" ", "_")
        
        address = URIRef("http://schema.org/address/tr" + str(i))
        language = URIRef("https://en.wikipedia.org/wiki/Language"+identificator)
        person = URIRef("http://www.semanticweb.org/notis/" + identificator)
        gg.add((person, RDF.type, translatorClass))
        gg.add((person, FOAF.firstName, Literal(translator["firstName"])))
        gg.add((person, FOAF.lastName, Literal(translator["lastName"])))
        gg.add((person, FOAF.phoneNo, Literal(translator["phoneNo"])))
        gg.add((person, FOAF.schedule, Literal(translator["schedule"])))
        gg.add((person, FOAF.authorisationNr, Literal(translator["authorisation_no"])))
        gg.add((address, FOAF.city, Literal(translator["city"])))
        gg.add((address, FOAF.courtOfAppeal, Literal(translator["court_of_appeal"])))
        gg.add((person, FOAF.address, address))
        gg.add((address, FOAF.coordinates, Literal(translator["coordinates"])))
        gg.add((person, FOAF.languages, Literal(translator["languages"])))

    file2 = open("output-trans.txt", "wb")
    file2.write(gg.serialize(format='pretty-xml'))

def main():
    list_of_translators = read_translators()
    createRDF(list_of_translators)



if __name__ == '__main__':
    main()