let currentCategory = 'villas';

const switchCategory = (category) => {
  currentCategory = category;
  renderFilters();
  clearResults();
};

const renderFilters = () => {
  const filters = document.getElementById('filters');
  filters.innerHTML = '';

  if (currentCategory === 'villas') {
    filters.innerHTML = `
      <h2>Filtres Villas</h2>
      <label><input type="checkbox" id="piscine"> Piscine</label>
      <label><input type="checkbox" id="balcon"> Balcon</label>
      <label><input type="checkbox" id="jardin"> Jardin</label>
      <label>Intérieur :
        <select id="interieur">
          <option value="">--</option>
          <option value="rouge">Rouge</option>
          <option value="blanc">Blanc</option>
          <option value="simple">Maison Simple</option>
       </select>
      </label>
      <label>Garage :
        <select id="garage">
          <option value="">--</option>
          <option value="2">2 places</option>
          <option value="6">6 places</option>
          <option value="10">10 places</option>
        </select>
      </label>
      <input type="number" id="prix" placeholder="Prix maximum (optionnel)">
      <button id="recherche" onclick="filterVillas()">Rechercher</button>
    `;
  }

  if (currentCategory === 'zones') {
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

  if (currentCategory === 'garages') {
    filters.innerHTML = `
      <h2>Filtres Garages Non Liés</h2>
      <label for="adresseGarage">Adresse du bien :</label>
      <input type="text" id="adresseGarage" placeholder="Ex : Vespucci, Downtown...">
      <button id="recherche" onclick="filterGarages()">Rechercher</button>
    `;
  }
};

const clearResults = () => {
  document.getElementById('results').innerHTML = '';
};

const filterVillas = async () => {
  const piscine = document.getElementById('piscine').checked;
  const balcon = document.getElementById('balcon').checked;
  const jardin = document.getElementById('jardin').checked;
  const garage = document.getElementById('garage').value;
  const interieur = document.getElementById('interieur').value;
  const prix = document.getElementById('prix').value;

  const res = await fetch('data/villas.json');
  const villas = await res.json();

  const filtered = villas.filter(v =>
    (!piscine || v.piscine) &&
    (!balcon || v.balcon) &&
    (!jardin || v.jardin) &&
    (!interieur || (v.interieur && v.interieur.toLowerCase().includes(interieur.toLowerCase()))) &&
    (!garage || (v.garage && v.garage.includes(garage))) &&
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

const displayResults = (list) => {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (list.length === 0) {
    results.innerHTML = '<p>Aucun résultat trouvé.</p>';
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const previewPhotos = item.photos?.slice(0, 2) || [];
    const allPhotos = [
      ...(item.photos?.map(photo => `assets/photos/${photo}`) || []),
      ...(item.gps ? [`assets/photos/${item.gps}`] : [])
    ];

    card.innerHTML = `
      <div class="card-header">
        ${item.interieur ? `<span class="tag">${item.interieur}</span>` : ''}
        ${item.prix ? `<span class="tag"><p><strong>Prix :</strong> $${parseInt(item.prix).toLocaleString()}</p></span>` : ''}
      </div>

      <div class="card-main-info">
        <h3>${item.adresse}</h3>
        ${item.garage ? `<p><strong>Garage :</strong> ${item.garage}</p>` : ''}
        ${item.prixgarage ? `<p><strong>Prix garage :</strong> $${parseInt(item.prixgarage).toLocaleString()}</p>` : ''}
        ${item.info ? `<p><strong>Info :</strong> ${item.info}</p>` : ''}
      </div>

      <div class="card-photos photos">
        ${previewPhotos.map((photo, index) => `<img src="assets/photos/${photo}" data-index="${index}" alt="photo villa">`).join('')}
      </div>

      <button class="voir-plus-btn">Voir plus</button>
    `;

    const voirPlusBtn = card.querySelector('.voir-plus-btn');
    voirPlusBtn.addEventListener('click', () => openDetailsModal(item));

    const images = card.querySelectorAll('.card-photos img');
    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const imgList = allPhotos;
        const clickedIndex = [...images].findIndex(i => i === img);
        openSlider(imgList, clickedIndex);
      });
    });

    results.appendChild(card);
  });
};

// ---------- MODALE DE DÉTAIL ----------
function openDetailsModal(item) {
  const modal = document.getElementById('detailsModal');
  const modalContent = document.getElementById('modalDetails');

const allImages = [
  ...(item.photos || []).map(p => `<img src="assets/photos/${p}" class="grid-img" />`),
  ...(item.gps ? [`<img src="assets/photos/${item.gps}" class="grid-img gps-img" />`] : [])
].join('');


  modalContent.innerHTML = `
    <h2 class="adress">${item.adresse}</h2>
    <div class="image-grid">${allImages}</div>
    ${item.interieur ? `<p><strong>Intérieur :</strong> ${item.interieur}</p>` : ''}
    ${item.prix ? `<p><strong>Prix :</strong> $${parseInt(item.prix).toLocaleString()}</p>` : ''}
    ${item.garage ? `<p><strong>Garage :</strong> ${item.garage}</p>` : ''}
    ${item.prixgarage ? `<p><strong>Prix Garage :</strong> $${parseInt(item.prixgarage).toLocaleString()}</p>` : ''}
    ${item.info ? `<p><strong>Info :</strong> ${item.info}</p>` : ''}
    <div class="characteristics">
      ${item.piscine ? '<span class="tag">Piscine</span>' : ''}
      ${item.balcon ? '<span class="tag">Balcon</span>' : ''}
      ${item.jardin ? '<span class="tag">Jardin</span>' : ''}
      ${item.terrasse ? '<span class="tag">Terrasse</span>' : ''}
    </div>

  `;

  modal.style.display = 'flex';

  // Pour fermer en cliquant hors du contenu
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeDetailsModal();
  });
}


function closeDetailsModal() {
  document.getElementById('detailsModal').style.display = 'none';
}

// ---------- AJOUT MODALE HTML DANS LE DOM ----------
document.body.insertAdjacentHTML('beforeend', `
  <div id="detailsModal" class="modal">
    <div class="modal-content">
      <span class="close-modal" onclick="closeDetailsModal()">✖</span>
      <div id="modalDetails"></div>
    </div>
  </div>
`);

// ---------- CSS À AJOUTER ----------
const style = document.createElement('style');
style.textContent = `
.modal {
  display: none;
  position: fixed;
  z-index: 1500;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background-color: rgba(0,0,0,0.6);
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #2a2a2a;
  margin: 5% auto;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
  position: relative;
}
.close-modal {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
}
.modal-content img {
  max-width: 100%;
  height: auto;
}
.card landscape {
  display: grid;
}
.adress {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #e0e0e0;
  text-align: center;
}
.gps-img {
  width: 500px;
  max-width: 350px;
  height: auto;
  border-radius: 5px;
  display: block;
}
.card.landscape {
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fff;
}
.card.landscape .card-photos {
  flex-shrink: 0;
  width: 180px;
}
.card.landscape .card-main-info {
  flex: 1;
}
.characteristics {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.characteristics .tag {
  background-color: #ffe7bf;
  color: #c87b00ff;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85em;
  display: inline-block;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
}
.grid-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
  max-height: 180px;
}
.grid-img:hover {
  filter: brightness(0.9);
}
`;
document.head.appendChild(style);

// ---------- LANCEMENT ----------
switchCategory('villas');
