import pandas as pd
import random
from unidecode import unidecode
from rdflib import Graph, URIRef, BNode, Literal, Namespace
from random import randint
from rdflib.namespace import RDF, FOAF

def read_notaries():
    list_of_notaries = []
    dfs = pd.read_excel("notari.xlsx")
    coordinatesList = [
    {"lat":47.17296962, "long":27.56250858},
    {"lat":47.17477834, "long":27.58430958},
    {"lat":47.17839558, "long":27.54173756},
    {"lat":47.17880397, "long":27.5510931},
    {"lat":47.18166256, "long":27.56525517},
    {"lat":47.1785706, "long":27.57787228},
    {"lat":47.17524509, "long":27.56748676},
    {"lat":47.17880397, "long":27.4982214},
    {"lat":47.17792886, "long":27.48165607},
    {"lat":47.14127796, "long":27.53753185},
    {"lat":47.12586303, "long":27.55710125},
    {"lat":47.15470399, "long":27.68949509},
    ]

    for index, row in dfs.iterrows():
        lastNameFirstName = row["Nume si prenume"].split(" ");
        lastName = lastNameFirstName[0]
        firstName = ' '.join(lastNameFirstName[1:]).strip()
        room = row["Camera"].strip()
        address = row["Adresa sediu"]
        locality = row["Localitate"]
        city = row["Judet"]
        phoneNo = "074" + str(random_with_N_digits(7))

        if(type(locality) == 'str'):
            locality = unidecode(locality)

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

        notary = {
            "lastName" : unidecode(lastName),
            "firstName" : unidecode(firstName),
            "room" : unidecode(room),
            "address":address,
            "locality":locality,
            "city":unidecode(city),
            "phoneNo":phoneNo,
            "isSupportedForeignCitizens":random.choice([0, 1]),
            "schedule": schedule,
            "coordinates":coordinates
        }

        if "IASI" in unidecode(city):
            list_of_notaries.append(notary)
        # TO DO ACTE

    return list_of_notaries

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

def createRDF(list_of_notaries):

    notaryClass = URIRef("http://www.semanticweb.org/notis/notaryPerson")
    # translatorClass = URIRef("https://www.merriam-webster.com/dictionary/translator")
    # addressClass = URIRef("https://dictionary.cambridge.org/dictionary/english/address")
    gg = Graph()
    gg.add((notaryClass, RDF.type, FOAF.Person))
    # gg.add((translatorClass, RDF.type, FOAF.Person))

    for i in range(10):
        notary = list_of_notaries[i]
        identificator = str(notary["firstName"] +"_"+ notary["lastName"]).replace(" ","_")
        # print(identificator)
        address = URIRef("http://schema.org/address/" + str(i))
        person = URIRef("http://www.semanticweb.org/notis/"+identificator)
        gg.add((person, RDF.type, notaryClass))
        gg.add((person, FOAF.firstName, Literal(notary["firstName"])))
        gg.add((person, FOAF.lastName, Literal(notary["lastName"])))
        gg.add((person, FOAF.phoneNo, Literal(notary["phoneNo"])))
        gg.add((person, FOAF.isSupportedForeignCitizens, Literal(notary["isSupportedForeignCitizens"])))
        gg.add((person, FOAF.schedule, Literal(notary["schedule"])))
        gg.add((address, FOAF.street, Literal(notary["address"])))
        gg.add((address, FOAF.locality, Literal(notary["locality"])))
        gg.add((address, FOAF.city, Literal(notary["city"])))
        gg.add((address, FOAF.coordinates, Literal(notary["coordinates"])))
        gg.add((person, FOAF.address, address))
        #TO DO DOCUMENTS

    file2 = open("output2.txt", "wb")
    file2.write(gg.serialize(format='pretty-xml'))

def main():
    list_of_notaries= read_notaries()
    # list_of_translators = read_translators()
    createRDF(list_of_notaries)
    # createRDF(list_of_notaries, list_of_translators)



if __name__ == '__main__':
    main()