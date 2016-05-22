# vvk-ui
[VVK:n HTML-käyttöliittymä](http://koneidenkapinaadele.github.io/vvk-ui/)

## Kehitysympäristö
* Ei tarvetta tehdä buildia, riittää kun avaa `index.html` sivun selaimeen. Tiedostojärjestelmästä avattu sivu ei kuitenkaan toimi tietoturvarajoitusten vuoksi kunnolla joten helpompaa on ajaa Node.js:llä `npm start`, jolloin sivustoa tarjoillaan `localhost:8081`-osoitteessa.
* VVK-backend on oletuksena `https://secret-oasis-98680.herokuapp.com` mutta sen voi vaihtaa lennossa suorittamalla selaimen konsolissa `vvk.backendUrl = 'http://localhost:8080';`
