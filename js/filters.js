function renderFilters(category) {
  const filters = document.getElementById('filters');
  filters.innerHTML = '';

  if (category === 'villas') {
    filters.innerHTML = `
      <h2>Filtres Villas</h2>
      <label><input type="checkbox" id="piscine"> Piscine</label>
      <label><input type="checkbox" id="balcon"> Balcon</label>
      <label><input type="checkbox" id="jardin"> Jardin</label>

      <fieldset id="interieur-filters">
        <legend>Intérieur :</legend>
        <label class="pill"><input type="checkbox" name="interieur" value="rouge"> Rouge</label>
        <label class="pill"><input type="checkbox" name="interieur" value="blanc"> Blanc</label>
        <label class="pill"><input type="checkbox" name="interieur" value="maison simple"> Maison Simple</label>
        <label class="pill"><input type="checkbox" name="interieur" value="maison de luxe"> Maison de luxe</label>
        <label class="pill"><input type="checkbox" name="interieur" value="villa de luxe"> Villa de luxe</label>
      </fieldset>

      <fieldset id="garage-filters">
        <legend>Garage :</legend>
        <label class="pill"><input type="checkbox" name="garage" value="2"> 2 places</label>
        <label class="pill"><input type="checkbox" name="garage" value="6"> 6 places</label>
        <label class="pill"><input type="checkbox" name="garage" value="10"> 10 places</label>
      </fieldset>

      <input type="number" id="prix" placeholder="Prix maximum (optionnel)">
      <button id="recherche" onclick="filterVillas()">Rechercher</button>
    `;
  }

  if (category === 'zones') {
    filters.innerHTML = `
      <h2>Filtres Zones de Luxe</h2>
      <label><input type="checkbox" id="garage"> Garage</label>
      <label>Type d'intérieur :
        <select id="interieur">
          <option value="">--</option>
          <option value="Duplex">Duplex</option>
          <option value="Appartement Moderne">Appartement Moderne</option>
          <option value="Appartement de luxe">Appartement de luxe</option>
        </select>
      </label>
      <input type="number" id="prix" placeholder="Prix maximum (optionnel)">
      <button id="recherche" onclick="filterZone()">Rechercher</button>
    `;
  }

  if (category === 'garages') {
    filters.innerHTML = `
      <h2>Filtres Garages Non Liés</h2>
      <label for="adresseGarage">Adresse du bien :</label>
      <input type="text" id="adresseGarage" placeholder="Ex : Vespucci, Downtown...">
      <button id="recherche" onclick="filterGarages()">Rechercher</button>
    `;
  }
}

function clearResults() {
  document.getElementById('results').innerHTML = '';
}

const filterVillas = async () => {
  const piscine = document.getElementById('piscine').checked;
  const balcon = document.getElementById('balcon').checked;
  const jardin = document.getElementById('jardin').checked;

  const interieurs = Array.from(document.querySelectorAll('input[name="interieur"]:checked'))
  .map(cb => cb.value);

  const garages = Array.from(document.querySelectorAll('input[name="garage"]:checked'))
  .map(cb => cb.value);

  const prix = document.getElementById('prix').value;

  const res = await fetch('data/villas.json');
  const villas = await res.json();

  const filtered = villas.filter(v =>
    v.disponible === true &&
    (!piscine || v.piscine) &&
    (!balcon || v.balcon) &&
    (!jardin || v.jardin) &&
    (interieurs.length === 0 || (v.interieur && interieurs.some(val =>
      v.interieur.toLowerCase().includes(val.toLowerCase())
    ))) &&
    (garages.length === 0 || (v.garage && garages.some(val =>
      v.garage.toString().includes(val)
    ))) &&
    (!prix || (v.prix && parseInt(v.prix) <= parseInt(prix)))
  );

  displayResults(filtered);
};

const filterZone = async () => {
  const garage = document.getElementById('garage').checked;
  const interieur = document.getElementById('interieur').value;
  const prix = document.getElementById('prix').value;

  const res = await fetch('data/zone-luxe.json');
  const zones = await res.json();

  const filtered = zones.filter(v =>
    (!garage || v.garage) &&
    (!interieur || (v.interieur && v.interieur.toLowerCase().includes(interieur.toLowerCase()))) &&
    (!prix || (v.prix && parseInt(v.prix) <= parseInt(prix)))
  );

  displayResults(filtered);
};

const filterGarages = async () => {
  const inputAdresse = document.getElementById('adresseGarage').value.trim().toLowerCase();

  const res = await fetch('data/garages.json');
  const garages = await res.json();

  const filtered = garages.filter(g =>
    g.adresse.toLowerCase().includes(inputAdresse)
  );

  displayResults(filtered);
};