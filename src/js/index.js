import Notiflix from 'notiflix';
import ImgApiService from './fetch_data.js';
import LoadMoreBtn from './load_more.js';
import { createGallery } from './create_gallery.js';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.form-input'),
  gallery: document.querySelector('.gallery'),
};

const imgApiService = new ImgApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: 'true',
});

refs.form.addEventListener('submit', submitForm);
loadMoreBtn.button.addEventListener('click', loadMoreImages);

function submitForm(e) {
  e.preventDefault();
  clearGallery();
  imgApiService.resetPage();
  const searchValue = refs.input.value.trim();
  if (searchValue === '') {
    Notiflix.Notify.warning('Sorry, field cannot be empty.');
    loadMoreBtn.hide();

    return;
  }
  imgApiService.searchValue = searchValue;
  fetchAndGenerateImages();
  loadMoreBtn.show();
  loadMoreBtn.disable();
}

async function fetchAndGenerateImages() {
  try {
    const res = await imgApiService.getData();
    const { hits, totalHits } = res.data;
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
      return;
    }
    Notiflix.Notify.success(`Total result: ${totalHits}`);
    const page = imgApiService.page;
    const maxPage = Math.ceil(totalHits / 40);
    if (page >= maxPage) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
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
  fetchAndGenerateImages();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
// async function fetchArcticles() {
//   try {
//     loadMoreBtn.button.disable();

//     const hits = await generateImgMarkup();
//     console.log(hits);
//     // if (hits === undefined) throw new Error();

//     const imgList = createGallery(hits);
//     refs.gallery.insertAdjacentHTML('beforeend', imgList.join(''));
//   } catch (err) {
//     // clearGallery();
//     // Notiflix.Notify.failure('No data');
//   }
// }
// async function generateImgMarkup() {
//   try {
//     const res = await imgApiService.getData();
//     const { hits, totalHits } = res.data;
//     const nextPage = imgApiService.page;

//     const maxPage = Math.ceil(totalHits / 40);
//     if (nextPage > maxPage) {
//       loadMoreBtn.hide();
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     if (totalHits === 0) {
//       throw new Error();
//     }

//     loadMoreBtn.enable();
//     console.log(hits);
//     return hits;
//   } catch (error) {
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// }
// function clearGallery() {
//   refs.gallery.innerHTML = '';
// }
