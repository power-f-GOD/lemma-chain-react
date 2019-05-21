
//selectors
let Q = document.querySelector.bind(document),
    QAll = document.querySelectorAll.bind(document);



//load script when DOM is ready
this.addEventListener('DOMContentLoaded', function()
{
  let rec = Q('.recommended-dropdown'),
      req = Q('.required-dropdown');


  //toggle between hiding and showing dropdown menu
  Q('.ref-dropdown-wrapper').addEventListener('click', function()
  {
    Q('.dropdown-container').classList.toggle('hide');
    Q('.ref-dropdown-icon').classList.toggle('icon-flip');

    if (Q('.dropdown-container').classList.contains('hide'))
      resizeDropdownHeight(0);
    else
      resizeDropdownHeight([Q('.active-dropdown')]);
  });


  //display required references
  Q('.required-btn').addEventListener('click', function()
  { toggleReferences(this, this.nextElementSibling, req, rec); });


  //display recommended references
  Q('.recommended-btn').addEventListener('click', function()
  { toggleReferences(this.previousElementSibling, this, rec, req); });


  // references toggler
  function toggleReferences(btn0, btn1, activDrop, inactivDrop)
  {
    if (/act/.test(btn0.className))
      btn0.classList.remove('active'),
      btn1.classList.add('active'),
      btn0.innerHTML = 'Required',
      btn1.innerHTML = '› Recommended ‹';
    else
      btn0.classList.add('active'),
      btn1.classList.remove('active'),
      btn0.innerHTML = '› Required ‹',
      btn1.innerHTML = 'Recommended';
    
    inactivDrop.classList.remove('active-dropdown');
    inactivDrop.classList.add('inactive-dropdown');
    activDrop.classList.remove('inactive-dropdown');
    activDrop.classList.add('active-dropdown');
    resizeDropdownHeight([activDrop]);
  }


  function resizeDropdownHeight(refs, cons = Q('.top-toggle-wrapper'))
  {
    let height = refs.concat ? refs.concat(cons).reduce((a, b) => a.offsetHeight + b.offsetHeight) : 0;
    Q('.dropdown-container').style.height = `${height}px`;
  }
});