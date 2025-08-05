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

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeDetailsModal();
  });
}

function closeDetailsModal() {
  document.getElementById('detailsModal').style.display = 'none';
}
