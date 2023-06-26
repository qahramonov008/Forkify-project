import icons from "url:../../img/icons.svg"
class View {
    _data;

    render(data, render = true) {

        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

        this._data = data

        const markup = this._generateMarkup()

        if(!render) return markup

        this._clearAndRenderMarkup(markup)
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `
    
        this._clearAndRenderMarkup(markup)
    }

    renderError(msg = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
        `

        this._clearAndRenderMarkup(markup)
    }

    renderMessage(msg = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
        `

        this._clearAndRenderMarkup(markup)
    }

    _clearAndRenderMarkup(markup) {
        this._parentElement.innerHTML = ''
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }
}

export default View