
try {

  var modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  modal.classList.add("modalClass");

  var modalCtt = new Image();
  modalCtt.classList.add("modalContentClass");
  modalCtt.setAttribute("id", "show");

  var modalCpt = document.createElement("div");
  modalCpt.setAttribute("id", "caption");

  var closeBtn = document.createElement("span");
  closeBtn.classList.add("closeClass");
  closeBtn.innerHTML = "&times;"
  closeBtn.onclick = function () {
    modalCtt.src = '';
    modalCpt.innerHTML = '';
    modal.style.display = "none";
  }

  modal.appendChild(closeBtn);
  modal.appendChild(modalCtt);
  modal.appendChild(modalCpt);

  var background = document.createElement("div");
  background.setAttribute("id", "background");
  background.classList.add("rowClass");

  var main = document.createElement("div");
  main.setAttribute("id", "main");
  main.appendChild(modal);
  main.appendChild(background);

  var container = document.createElement("div");
  container.setAttribute("id", "container");
  container.appendChild(main);


  var sheet = (function () {
    var style = document.createElement("style");
    document.head.appendChild(style);
    return style.sheet;
  })();

  async function setBackGroundCats(element, rows, lines) {

    var max = Math.round(rows * lines);

    var params = { max };
    var i = 0
    const { data } = await axios.get('/cats', { params })

    for (let r = 0; r < rows; r++) {
      let row = document.createElement('div');
      row.classList.add('columnClass');
      for (let l = 0; l < lines; l++) {
        const { img, imgOrig, title } = data[i];
        image = new Image();
        image.src = img;
        image.alt = title;
        image.setAttribute("id", 'img' + i)
        image.onclick = function () {
          modalCtt.src = imgOrig;
          modalCpt.innerHTML = title;
          modal.style.display = "block";
        }
        row.appendChild(image);
        i++
      }
      element.appendChild(row);
    }
  }

  var isWide = window.innerWidth > window.innerHeight;
  var rows = 3 + ((isWide) ? 2 : 1);
  var lines = 4 + ((isWide) ? 2 : 5);

  setBackGroundCats(background, rows, lines);

  document.body.appendChild(container);

  document.body.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      modalCtt.src = '';
      modalCpt.innerHTML = '';
      modal.style.display = "none";
    }
  });


} catch (err) {
  console.error(err);
}