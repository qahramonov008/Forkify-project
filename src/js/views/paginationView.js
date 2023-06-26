import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    // render next btn
    if (this._data.pageNumber === 1 && numPages > 1)
      return this._generateNextButton();

    // Last page
    // render back btn
    if (this._data.pageNumber === numPages && numPages > 1)
      return this._generateBackButton();

    // other pages
    // render back btn and next btn
    if (this._data.pageNumber < numPages)
      return `${this._generateNextButton()} ${this._generateBackButton()}`;

    // Page 1, and there are not other pages
    // no btn
    return '';
  }

  _generateBackButton() {
    return `
            <button class="btn--inline pagination__btn--prev" data-goto="${this._data.pageNumber - 1}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.pageNumber - 1}</span>
            </button>
        `;
  }

  _generateNextButton() {
    return `
            <button class="btn--inline pagination__btn--next" data-goto="${this._data.pageNumber + 1}">
                <span>Page ${this._data.pageNumber + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
  }
}

export default new PaginationView();
