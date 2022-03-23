import './sass/main.scss';
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let simplLightboxGallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const imagesRendering = obj => {
  const imageCard = obj.data.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a class="photo-card" href = "${largeImageURL}"><div>
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
  </div>
</div></a>`;
    })
    .join('');

  if (obj.data.hits.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  }

  refs.gallery.innerHTML = imageCard;

  // console.log(refs.card);
};

const submit = e => {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value;

  fetchImages(inputValue).then(images => imagesRendering(images));
};

refs.form.addEventListener('submit', submit);
