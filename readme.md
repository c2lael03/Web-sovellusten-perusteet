# Sääsivusto

**Tekijä:** [Elina Lappalainen]

## Kuvaus

Tämä on yksinkertainen ja responsiivinen sääsivusto, joka tarjoaa käyttäjälle reaaliaikaiset säätiedot hänen tämänhetkisen sijaintinsa perusteella. Sivusto näyttää keskeiset säätiedot, kuten lämpötilan, sääolosuhteet, tuulen nopeuden ja suunnan, kosteuden sekä sademäärän ja lumisateen tunneittain. Käyttäjä voi myös tarkastella tunneittaista ennustetta seuraaville tunneille sekä viikon päivittäistä ennustetta. Lisäksi sivustolla on sadekartta, joka visualisoi odotettavissa olevan sademäärän seuraavien tuntien aikana. Jatkokehityskohteena on esimerkiksi Asetukset-sivulta löytyvät valikot, joissa käyttäjä voi vaihtaa näytettävää mittayksikköä esimerkiksi lämpötilan (Celsius tai Fahrenheit) tai tuulen nopeuden (m/s tai jalkaa/sekunti) suhteen.

## Asennus

Tämä sääsivusto on pääosin staattinen verkkosovellus, joka toimii suoraan selaimessa. Asennusvaiheet ovat seuraavat:

    Lataa tiedostot: Lataa kaikki projektin tiedostot (HTML-tiedostot kuten index.html, sadekartta.html, asetukset.html, CSS-tiedostot kuten style.css, ja JavaScript-tiedostot kuten functions.js, sadekartta.js) samaan kansioon tietokoneellasi.
    Avaa index.html: Voit avata index.html-tiedoston suoraan selaimellasi (esimerkiksi tuplaklikkaamalla tiedostoa). Tällöin sivusto toimii, mutta on suositeltavaa käyttää paikallista web-palvelinta parhaan toimivuuden takaamiseksi.
    (Suositus) Käytä paikallista web-palvelinta:

    Jos sinulla on Node.js asennettuna, voit asentaa yksinkertaisen HTTP-palvelimen komennolla:
    Bash

npm install -g http-server

Navigoi projektikansioosi komentorivillä ja käynnistä palvelin komennolla:
Bash

http-server

Avaa sitten sääsivusto selaimessasi osoitteessa, joka komentorivillä näkyy (yleensä http://localhost:8080). Tämä tapa varmistaa, että kaikki resurssit ladataan oikein ja sijainnin haku toimii luotettavammin.

Esimerkiksi:

1.  Lataa kaikki tiedostot (HTML, CSS, JavaScript) samaan kansioon.
2.  Avaa `index.html` selaimessa.
3.  **Suositus:** Käytä paikallista web-palvelinta (esim. `http-server` Node.js:llä) välttääksesi mahdolliset ongelmat sijainnin haussa ja resurssien latauksessa. Jos sinulla on Node.js asennettuna, voit asentaa `http-serverin` komennolla: `npm install -g http-server` ja käynnistää sen projektikansiossasi komennolla `http-server`. Avaa sitten sivu osoitteessa `http://localhost:8080`.

## Käyttö

Tämä sääsivusto on suunniteltu olemaan helppokäyttöinen ja suoraviivainen. Tässä ohjeet sivuston eri osioiden käyttöön:

* **Etusivu:**
        Sivun latautuessa sovellus pyytää lupaa käyttää sijaintiasi. Salli tämä, jotta näet ajantasaiset säätiedot omalta paikkakunnaltasi.
        Etusivulla näet tämänhetkisen lämpötilan, lyhyen kuvauksen sääolosuhteista (esim. "selkeää", "pilvistä"), tuulen nopeuden ja suunnan, ilmankosteuden sekä tiedot mahdollisesta sateesta ja lumesta.
        Sivun yläosassa näkyy paikkakuntasi nimi (jos API sen palauttaa) ja sivun alaosassa sijaintisi koordinaatit.

* **Tuntiennuste:**
        Navigoi sivun yläosassa olevaa valikkoa klikkaamalla "Tuntiennuste".
        Tällä sivulla näet graafisen esityksen odotettavissa olevasta sademäärästä seuraavien tuntien aikana. Pylväiden korkeus kuvastaa sademäärää (millimetreinä).

* **Viikkoennuste:**
        Navigoi valikosta "Viikkoennuste".
        Tällä sivulla näet lyhyen sääennusteen tuleville päiville, yleensä seuraavalle viikolle. Esillä on kunkin päivän sääkuvake ja odotettu lämpötila.

* **Sademäärä:**
        Navigoi valikosta "Sademäärä".
        Tällä sivulla näet graafisen esityksen odotettavissa olevasta sademäärästä seuraavien tuntien aikana pylväinä. Aikajana näkyy x-akselilla ja sademäärä y-akselilla.

* **Asetukset:**
        Navigoi valikosta "Asetukset".
        Tällä sivulla voit vaihtaa lämpötilan näyttöyksikön Celsiusasteista (°C) Fahrenheitasteiksi (°F) ja päinvastoin.
        Valitse haluamasi yksikkö painamalla vastaavaa painiketta. Asetus tallentuu selaimesi muistiin, joten se säilyy myös seuraavilla kerroilla, kun avaat sivuston.

## Lisätietoja

* Sovellus käyttää OpenWeatherMapin avointa sää-APIa säätietojen hakemiseen.
* Sijainnin hakemiseen käytetään selaimen `geolocation` APIa.
* Kaavioiden piirtämiseen käytetään Chart.js -kirjastoa.

## Huomautuksia

* Lämpötilayksikön vaihto saattaa vaatia sivun uudelleenlatauksen, jotta kaikki tiedot päivittyvät.
* Sademäärä saattaa näyttää tyhjältä, jos alueella ei ole ennustettua sadetta.

## Lisenssi

Tämä projekti on tarkoitettu henkilökohtaiseen käyttöön, eikä siihen ole liitetty avoimen lähdekoodin lisenssiä. Kaikki oikeudet pidätetään.