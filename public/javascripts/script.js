
try {
  class CreateMainContainer {
    constructor() {
      this.body = document.body;
      this.container = this._createContainer();
      this.main = this._createMain()
      this.standBy = this._createStandByDiv()
      this.loadingPhoto = this._loadLoadingPhoto()
      this.loadingPage = this._loadLoadingPage()
      this._start()
    }
    _loadHTML(href) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", href, false);
      xmlhttp.send();
      return xmlhttp.responseText;
    }

    _loadLoadingPage() {
      let loadingPage = document.createElement('div');
      loadingPage.innerHTML = this._loadHTML('../loading-page');
      loadingPage.id = 'loadingPage';
      return loadingPage
    }

    _loadLoadingPhoto() {
      let loadingPhoto = document.createElement('div');
      loadingPhoto.innerHTML = this._loadHTML('../loading-photo');
      loadingPhoto.id = 'loadingPhoto';
      return loadingPhoto
    }

    _createContainer() {
      let container = document.createElement('div')
      container.id = 'container'
      return container
    }

    _createMain() {
      let main = document.createElement('div')
      main.id = 'main'
      return main
    }

    _createStandByDiv() {
      let standBy = document.createElement('div')
      standBy.id = 'standBy'
      return standBy
    }

    get() {
      return this.main
    }
    onStandBy() {
      this.standBy.tabIndex = 1
      this.standBy.style.display = "block";
    }

    offStandby() {
      this.standBy.tabIndex = null
      this.standBy.style.display = "none";
    }

    appendChild(...elements) {
      for (let i = 0; i < elements.length; i++) {
        this.main.appendChild(elements[i])
      }
    }

    getLoadingPhoto() {
      return this.loadingPhoto;
    }

    getLoadingPage() {
      return this.loadingPage;
    }

    _start() {
      this.standBy.appendChild(this.loadingPage);
      this.main.appendChild(this.standBy);
      this.container.appendChild(this.main)
      this.body.appendChild(this.container);
    }

  }
  class ModalController {
    constructor(loading) {
      this.closeBtnClassList = ['closeClass'];
      this.cttClassList = ['modalContentClass'];
      this.modalClassList = ['modalClass'];
      this.loadingClassList = ['modalLoadingClass']

      this.modal = this._createModal();
      this.photoDiv = this._createPhotoDiv();
      this.ctt = this._createCtt();
      this.cpt = this._createCpt();
      this.closeBtn = this._createCloseBtn();
      this.loading = this._createLoading(loading)

      this._start();
    }

    _createModal() {
      let modal = document.createElement('div');
      modal.id = 'modal'
      modal.classList.add(...this.modalClassList);
      modal.onkeydown = (event) => {
        var event = event || window.event;
        if (event.key === 'Escape') {
          this._modalReset();
        }
      }

      return modal;
    }

    _createPhotoDiv() {
      let photoDiv = document.createElement('div');
      photoDiv.id = 'photoDiv';
      return photoDiv;
    }

    _createCloseBtn() {
      let closeBtn = document.createElement('span');
      closeBtn.classList.add(...this.closeBtnClassList)
      closeBtn.innerHTML = '&times'
      closeBtn.onclick = () => {
        this._modalReset();
      }

      return closeBtn;
    }

    _createLoading(loading) {
      loading.classList.add(...this.loadingClassList);
      return loading;
    }

    _createCtt() {
      let ctt = new Image();
      ctt.id = 'ctt';
      ctt.style.loading = 'lazy';
      ctt.onloadstart = () => {
        ctt.style.zIndex = '-1';
        ctt.style.display = 'none';
        this.startLoading();
      }
      ctt.onload = () => {
        ctt.style.zIndex = '10';
        ctt.style.display = 'block';
        this.finishLoading()
      };
      ctt.classList.add(...this.cttClassList);
      return ctt;
    }

    _createCpt() {
      let cpt = document.createElement('div');
      cpt.id = 'caption'
      return cpt
    }

    _modalReset() {
      this.modal.tabIndex = 0
      this.ctt.src = '';
      this.cpt.innerHTML = '';
      this.modal.style.display = "none";
      this.modal.blur()
    }

    async setImg(img, title) {
      this.modal.tabIndex = 1
      this.ctt.src = img;
      this.cpt.innerHTML = title;
      this.modal.style.display = "block";
      this.modal.focus();
    }

    startLoading() {
      this.loading.style.zIndex = '10'
      this.loading.style.display = "block";
    }

    finishLoading() {
      this.loading.style.zIndex = '1'
      this.loading.style.display = "none";
    }

    get() {
      return this.modal
    }

    appendChild(...element) {
      for (let i = 0; i < element.length; i++) {
        this.modal.appendChild(element[i])
      }
    }

    _start() {
      this.photoDiv.appendChild(this.ctt)
      this.photoDiv.appendChild(this.loading)
      this.appendChild(this.closeBtn, this.photoDiv, this.cpt)
    }
  }
  class Background {
    constructor(modal) {
      this.modal = modal

      this.backgroundClassList = ['flexClass'];
      this.columnsClassList = ["columnClass"]
      this.linesClassList = []
      this.layerClassList = ["slideDownClass"]

      this.isWide = window.innerWidth > window.innerHeight;
      this.columns = 3 + ((this.isWide) ? 2 : 1);
      this.lines = 4 + ((this.isWide) ? 3 : 8);
      this.photosAmt = Math.round(this.columns * this.lines);

      this.background = this._createBackground();

      this._start()
    }

    _createBackground() {
      let background = document.createElement('div');
      background.id = 'background'
      background.classList.add(...this.backgroundClassList);
      return background;
    }

    async _getPhotoArray() {
      let params = { max: this.photosAmt }
      let { data } = await axios.get('/cats', { params })
      return data
    }

    async _createColumn(c) {
      let column = document.createElement('div');
      column.classList.add(...this.columnsClassList);
      column.tabIndex = 1
      column.onmouseover = (event) => {
        this.pauseAnimation(column);
      };
      column.onmouseleave = (event) => {
        this.resumeAnimation(column);
      };
      let id = `column-${c}`
      column.id = id
      return column
    }

    async _createLayer(l) {
      let layer = document.createElement('div');
      layer.classList.add(...this.layerClassList)
      let id = `layer`
      layer.id = id
      return layer
    }

    async _createPhoto(img, imgOrig, title, l) {

      let image = new Image();
      image.src = img;
      image.alt = title;
      image.classList.add(...this.linesClassList);
      let id = `photo-${l}`
      image.id = id;
      image.modal = this.modal
      image.style.order = 1
      image.onclick = () => {
        this.modal.setImg(imgOrig, title);
      };
      return image;
    }

    async _setPhotoToColumn(photos) {
      let i = photos.length - 1
      let columns = []

      for (let c = 0; c < this.columns; c++) {
        let column = await this._createColumn(c);
        for (let t = 0; t < 2; t++) {
          let layer = await this._createLayer(t)
          for (let l = 0; l < this.lines; l++) {
            let { img, imgOrig, title } = photos[i - l];
            let image = await this._createPhoto(img, imgOrig, title, l);
            layer.appendChild(image);
            column.appendChild(layer);
            columns.push(column)
          }
        }
        i = i - this.lines
      }
      return columns
    }

    get() {
      console.log(this.background.readyState)
      return this.background
    }

    getAllColumns() {
      return this.background.children
    }

    getColumnByNumber(n) {
      let column = this.background.children[n];
      if (column) {
        return column
      }
      return 0
    }

    getPhotoByNumber(c, n) {
      let columnId = c
      let photoId = n
      let photo = this.background.children[columnId].children[photoId];
      if (photo) {
        return photo
      }
      return 0
    }

    pauseAnimation(column) {
      let layers = column.children;
      let layersAmt = layers.length;
      for (let i = 0; i < layersAmt; i++) {
        let layer = layers[i]
        layer.style.animationPlayState = "paused";
      }
    }

    resumeAnimation(column) {
      let layers = column.children;
      let layersAmt = layers.length;
      for (let i = 0; i < layersAmt; i++) {
        let layer = layers[i]
        layer.style.animationPlayState = "running";
      }
    }

    pauseAllAnimation() {
      let columns = this.getAllColumns();
      let columnsAmt = columns.length;
      for (let i = 0; i < columnsAmt; i++) {
        let column = columns[i];
        this.pauseAnimation(column);
      }
    }

    resumeAllAnimation(column) {
      let columns = this.getAllColumns();
      let columnsAmt = columns.length;
      for (let i = 0; i < columnsAmt; i++) {
        let column = columns[i];
        this.resumeAnimation(column);
      }
    }

    appendChild(...element) {
      for (let i = 0; i < element.length; i++) {
        this.background.appendChild(element[i])
      }
    }

    async _start() {
      let photos = await this._getPhotoArray()
      let columns = await this._setPhotoToColumn(photos)
      this.appendChild(...columns)
    }
  }

  let main = new CreateMainContainer()

  let modal = new ModalController(main.getLoadingPhoto());
  let background = new Background(modal);
  main.appendChild(modal.get(), background.get());

  document.onblur = () => {
    console.log(document.blur)
    main.onStandBy()
    background.pauseAllAnimation()
  }

  document.onfocus = () => {
    main.offStandby()
    background.resumeAllAnimation()
    document.readyState
  }

} catch (err) {
  console.error(err);
}

