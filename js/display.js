function displayResults(list) {
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

    card.querySelector('.voir-plus-btn').addEventListener('click', () => openDetailsModal(item));

    const images = card.querySelectorAll('.card-photos img');
    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const clickedIndex = [...images].indexOf(img);
        openSlider(allPhotos, clickedIndex);
      });
    });

    results.appendChild(card);
  });
}
