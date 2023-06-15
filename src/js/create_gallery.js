export function createGallery(data) {
  const img = data.map(e => {
    return `<div class="photo-card">
      <img src="${e.webformatURL}" alt="${e.tags}" width='350' height="250" loading="lazy" />
      <ul class="info">
    <li class="info-item">
      <p>Likes:</p>
      <p class="info-item">
        <b>${e.likes}</b>
      </p>
    </li>
    <li class="info-item">
      <p>Views:</p>
      <p class="info-item">
        <b>${e.views}</b>
      </p>
    </li>
    <li class="info-item">
      <p>Commenst:</p>
      <p class="info-item">
        <b>${e.comments}</b>
      </p>
    </li>
    <li class="info-item">
      <p>Downloads:</p>
      <p class="info-item">
        <b>${e.downloads}</b>
      </p>
    </li>
  </ul>
    </div>`;
  });
  return img;
}
