import './sass/main.scss';
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { remove } from 'lodash';
var throttle = require('lodash.throttle');

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  onOffLoadMoreBtn: document.querySelector('.switch'),
};

let page = 1;
let inputValue = '';
let offScroll = false;

const imagesRendering = async obj => {
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
  refs.loadMoreBtn.classList.contains('visually-hidden') ? (offScroll = false) : (offScroll = true);

  const images = await fetchImages(inputValue, page);

  if (images.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    refs.gallery.innerHTML = '';
    return;
  } else {
    Notiflix.Notify.info(`Hooray! We found ${images.data.totalHits} images.`);
    setTimeout(() => Notiflix.Notify.info(`Слава ЗСУ!`), 3000);
  }

  imagesRendering(images);

  if (images.data.totalHits <= document.querySelectorAll('a').length) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    return;
  }

  let simplLightboxGallery = new SimpleLightbox('.gallery a', {});

  const { height: formHeight } = refs.form.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: formHeight * 2,
    behavior: 'smooth',
  });
}

async function loadMore() {
  page += 1;

  const images = await fetchImages(inputValue, page);

  imagesRendering(images);

  if (images.data.totalHits <= document.querySelectorAll('a').length) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

    return;
  }

  let simplLightboxGallery = new SimpleLightbox('.gallery a', {});

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const endlessLoading = async e => {
  let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

  if (windowRelativeBottom < document.documentElement.clientHeight + 100 && !offScroll) {
    page += 1;

    const images = await fetchImages(inputValue, page);

    await imagesRendering(images);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (images.data.totalHits <= document.querySelectorAll('a').length) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

      offScroll = true;
    }
  }

  let simplLightboxGallery = new SimpleLightbox('.gallery a', {});
};

const loadMoreBtnSwitcher = () => {
  if (refs.loadMoreBtn.classList.contains('visually-hidden')) {
    refs.loadMoreBtn.classList.remove('visually-hidden');
    refs.onOffLoadMoreBtn.style.color = 'green';
    offScroll = true;
  } else {
    refs.loadMoreBtn.classList.add('visually-hidden');
    refs.onOffLoadMoreBtn.style.color = 'red';
    offScroll = false;
  }
};

refs.form.addEventListener('submit', submit);
refs.loadMoreBtn.addEventListener('click', loadMore);
window.addEventListener('scroll', throttle(endlessLoading, 500));
refs.onOffLoadMoreBtn.addEventListener('click', loadMoreBtnSwitcher);
