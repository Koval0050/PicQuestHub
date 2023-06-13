import axios from 'axios';
import Notiflix from 'notiflix';
const API_KEY = '37256286-db119fb0cd78ccde07235d022';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.form-input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
let page = 1;
let totalHits = 0;
refs.loadMore.classList.add('visible');

refs.form.addEventListener('submit', e => {
  submitForm(e);
});
refs.loadMore.addEventListener('click', loadMore);

function submitForm(e) {
  e.preventDefault();
  const inputQ = refs.input.value;
  page = 1;
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${inputQ}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  getData(BASE_URL)
    .then(res => {
      if (res.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        // console.log(
        //   'Sorry, there are no images matching your search query. Please try again.'
        // );
      } else {
        totalHits = res.data.totalHits;
        const imgList = createGallery(res.data.hits);
        refs.gallery.innerHTML = '';
        refs.gallery.insertAdjacentHTML('beforeend', imgList.join(''));
        refs.loadMore.classList.remove('visible');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function loadMore() {
  const totalPages = Math.ceil(totalHits / 40);
  if (page >= totalPages) {
    console.log("We're sorry, but you've reached the end of search results.");
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
  console.log(page);
  page++;
  const inputQ = refs.input.value;
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${inputQ}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  getData(BASE_URL)
    .then(res => {
      const imgList = createGallery(res.data.hits);
      refs.gallery.insertAdjacentHTML('beforeend', imgList.join(''));
      if (page >= totalPages) {
        refs.loadMore.classList.add('visible');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function createGallery(data) {
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

async function getData(BASE_URL) {
  try {
    const res = await axios.get(BASE_URL);
    // console.log(res.data);
    return res;
  } catch (error) {
    console.error(error);
  }
}
