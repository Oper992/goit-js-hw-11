import './sass/main.scss';
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let page = 1;
let inputValue = '';

const imagesRendering = obj => {
  const markup = obj.data.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a class="gallery__item" href = "${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width = "370px"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div></a>`;
    })
    .join('');

  if (obj.data.hits.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  if (page === 1) {
    refs.gallery.innerHTML = markup;
  } else {
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  }
};

async function submit(e) {
  e.preventDefault();
  inputValue = e.currentTarget.elements.searchQuery.value;

  page = 1;

  const images = await fetchImages(inputValue, page);

  imagesRendering(images);

  refs.loadMoreBtn.classList.add('visually-hidden');
  refs.loadMoreBtn.classList.remove('visually-hidden');
}

async function loadMore() {
  page += 1;

  const images = await fetchImages(inputValue, page);

  imagesRendering(images);
}

refs.form.addEventListener('submit', submit);
refs.loadMoreBtn.addEventListener('click', loadMore);

let simplLightboxGallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
