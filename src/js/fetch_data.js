import axios from 'axios';
const API_KEY = '37256286-db119fb0cd78ccde07235d022';

export default class ImgApiService {
  constructor() {
    this.page = 1;
    this.searchValue = '';
  }
  async getData() {
    const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    this.incrementPage();
    return await axios.get(BASE_URL);
  }
  
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
