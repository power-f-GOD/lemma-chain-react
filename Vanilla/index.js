
//selectors
let Q = document.querySelector.bind(document),
    QAll = document.querySelectorAll.bind(document);



//load script when DOM is ready
this.addEventListener('DOMContentLoaded', function()
{
  //toggle between hiding and showing dropdown menu
  Q('.ref-dropdown-wrapper').addEventListener('click', function()
  {
    Q('.dropdown-container').classList.toggle('hide');
    Q('.ref-dropdown-icon').classList.toggle('icon-flip');
    resizeDropdownHeight(/hide/.test(Q('.dropdown-container').className) ? 0 : [Q('.active-dropdown')]);
  });


  //add dropdown references/sections toggle event listener
  QAll('.dropdown-btn').forEach((btn) => btn.addEventListener('click', () =>
  {
    let dropdownName = btn.getAttribute('data-dropdown-name');

    QAll('.dropdown-btn').forEach((btn) => 
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
});







