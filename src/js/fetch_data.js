import axios from 'axios';
const API_KEY = '37256286-db119fb0cd78ccde07235d022';

export default class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '37256286-db119fb0cd78ccde07235d022';
  constructor() {
    this.page = 1;
    this.query = null;
    this.perPage = 40;
  }
   fetchPhotosByQuery() {
    const res =  axios.get(`${this.#BASE_URL}/?`, {
      params: {
        imageType: 'photo',
        orientation: 'horizontal',
        q: this.query,
        page: this.page,
        per_page: this.perPage,
        key: this.#API_KEY,
        safesearch: true,
      },
    });
    this.incrementPage();
    return res;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}

