import Notiflix from 'notiflix';
import PixabayApi from './fetch_data.js';
import LoadMoreBtn from './load_more.js';
import { createGallery } from './create_gallery.js';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.form-input'),
  gallery: document.querySelector('.gallery'),
};

const pixabayApi = new PixabayApi();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: 'true',
});

let isFirstSearch = true;
let isLastPage = false;

refs.form.addEventListener('submit', submitForm);
loadMoreBtn.button.addEventListener('click', loadMoreImages);

function submitForm(e) {
  e.preventDefault();
  clearGallery();
  pixabayApi.resetPage();
  isFirstSearch = true;
  isLastPage = false;
  const searchValue = refs.input.value.trim();
  if (searchValue === '') {
    Notiflix.Notify.warning('Sorry, field cannot be empty.');
    loadMoreBtn.hide();

    return;
  }
  pixabayApi.query = searchValue;
  fetchAndGenerateImages();
  loadMoreBtn.show();
  loadMoreBtn.disable();
}

async function fetchAndGenerateImages() {
  try {
    const res = await pixabayApi.fetchPhotosByQuery();
    const { hits, totalHits } = res.data;
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
      return;
    }
    if (isFirstSearch) {
      // Check if it's the first search
      Notiflix.Notify.success(`Total result: ${totalHits}`);
      isFirstSearch = false; // Set the flag to false after displaying the message
    }
    const page = pixabayApi.page - 1;
    const maxPage = Math.ceil(totalHits / 40);
    if (page >= maxPage) {
      isLastPage = true;
      loadMoreBtn.hide();
    } else {
      loadMoreBtn.enable();
    }

    const imgList = createGallery(hits);
    refs.gallery.insertAdjacentHTML('beforeend', imgList.join(''));
  } catch (error) {
    Notiflix.Notify.failure('Failed to fetch images. Please try again.');
  }
}

async function loadMoreImages() {
  loadMoreBtn.disable();
  await fetchAndGenerateImages();
  if (isLastPage) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
