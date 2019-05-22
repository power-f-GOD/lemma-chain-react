
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
    resizeDropdownHeight(!/hide/.test(Q('.dropdown-container').className) ? [Q('.active-dropdown')] : 0);
  });


  //add dropdown references and sections event listener
  QAll('.dropdown-btn').forEach((btn) => btn.addEventListener('click', toggleDropdowns));


  function toggleDropdowns()
  {
    let dropdownName = this.getAttribute('data-dropdown-name');

    QAll('.dropdown-btn').forEach((btn) => 
    {
      btn.classList.remove('active'),
      Q(`.${btn.getAttribute('data-dropdown-name')}`).classList.add('inactive-dropdown');
    });
    this.classList.add('active');
    Q(`.${dropdownName}`).classList.remove('inactive-dropdown'); 
    resizeDropdownHeight([Q(`.${dropdownName}`)]);
  }


  function resizeDropdownHeight(refs, cons = Q('.top-toggle-wrapper'))
  {
    let height = refs.concat ? refs.concat(cons).reduce((a, b) => a.offsetHeight + b.offsetHeight) : 0;
    Q('.dropdown-container').style.height = `${height}px`;
  }
});