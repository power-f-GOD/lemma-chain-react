
//selectors
const Q = document.querySelector.bind(document),
      QAll = document.querySelectorAll.bind(document);

let dropdownBtns = QAll('.dropdown-btn');



//toggle between hiding and showing dropdown menu
Q('.ref-dropdown-wrapper').addEventListener('click', function()
{
  Q('.dropdown-container').classList.toggle('hide');
  Q('.ref-dropdown-icon').classList.toggle('icon-flip');
  resizeDropdownHeight(/hide/.test(Q('.dropdown-container').className) ? 0 : [Q('.active-dropdown')]);
});


//add dropdown references/sections toggle event listener
dropdownBtns.forEach((btn) => btn.addEventListener('click', () =>
{
  let dropdownName = btn.getAttribute('data-dropdown-name');

  dropdownBtns.forEach((btn) => 
  {
    btn.classList.remove('active'),
    Q(`.${btn.getAttribute('data-dropdown-name')}`).classList.remove('active-dropdown');
  });
  btn.classList.add('active');
  Q(`.${dropdownName}`).classList.add('active-dropdown');
  resizeDropdownHeight(/active/.test(Q(`.${dropdownName}`).className) ? [Q(`.${dropdownName}`)] : 0);
}));


function resizeDropdownHeight(refs, cons = Q('.top-toggle-wrapper'))
{
  let height = refs.concat ? refs.concat(cons).reduce((a, b) => a.offsetHeight + b.offsetHeight) : 0;
  Q('.dropdown-container').style.height = `${height}px`;
}


QAll('.dropdown-items-wrapper').forEach(item => item.addEventListener('click', () => updateView(item)));


function updateView(el)
{
  let itemHTML = `
        <div
        class='dropdown-items-wrapper'
        data-id='{id}'
        data-types='{types}'
        data-payload='{payload}'
      >
        <li class='dropdown-items'>
          <span class='props'>Title: <span class='title'>{title}</span></span>
          <span class='props'>Author: <span class='author'>{author}</span></span>
          <span class='props'>Ref. ID: <span class="ref">{ref}</span></span>
        </li>
      </div>`;

  let payload = JSON.parse(el.getAttribute('data-payload')),
      data = {
        title: payload.title,
        author: payload.author,
        id: el.getAttribute('data-id'),
        types: el.getAttribute('data-types')
      }

  el.querySelector()
}








