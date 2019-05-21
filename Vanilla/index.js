
//selectors
let Q = document.querySelector.bind(document),
    QAll = document.querySelectorAll.bind(document);


//load script when DOM is ready
this.addEventListener('DOMContentLoaded', function()
{
  let req = Q('.recommended-dropdown'),
      rec = Q('.required-dropdown');


  //toggle between hiding and showing dropdown menu
  Q('.ref-dropdown-wrapper').onclick = function()
  {
    Q('.dropdown-container').classList.toggle('hide');
    Q('.ref-dropdown-icon').classList.toggle('icon-flip');

    if (Q('.dropdown-container').classList.contains('hide'))
      resizeDropdownHeight(0);
    else
      resizeDropdownHeight([Q('.active-dropdown')]);
  };


  Q('.required-btn').onclick = function()
  {
    let req = Q('.recommended-dropdown'),
      rec = Q('.required-dropdown');
    this.classList.add('active');
    this.nextElementSibling.classList.remove('active');
    rec.classList.splice(rec.classList.indexOf('active-dropdown'), 1, 'inactive-dropdown');
    req.classList.splice(req.classList.indexOf('inactive-dropdown'), 1, 'active-dropdown');
    resizeDropdownHeight([Q('.required-dropdown')]);
  }


  //display required references
  Q('.required-btn').onclick = function()
  {
    this.classList.add('active');
    this.nextElementSibling.classList.remove('active');
    Q('.recommended-dropdown').classList.remove('active-dropdown');
    Q('.recommended-dropdown').classList.add('inactive-dropdown');
    Q('.required-dropdown').classList.remove('inactive-dropdown');
    Q('.required-dropdown').classList.add('active-dropdown');
    resizeDropdownHeight([Q('.required-dropdown')]);
  }


  //display recommended references
  Q('.recommended-btn').onclick = function()
  {
    this.classList.add('active');
    this.previousElementSibling.classList.remove('active');
    Q('.required-dropdown').classList.remove('active-dropdown');
    Q('.required-dropdown').classList.add('inactive-dropdown');
    Q('.recommended-dropdown').classList.remove('inactive-dropdown');
    Q('.recommended-dropdown').classList.add('active-dropdown');
    resizeDropdownHeight([Q('.recommended-dropdown')]);
  }


  function resizeDropdownHeight(refs, cons = Q('.top-toggle-wrapper'))
  {
    let height = refs.reduce ? refs.concat(cons).reduce((a, b) => a.offsetHeight + b.offsetHeight) : 0;

    Q('.dropdown-container').style.height = `${height}px`;
  }
});