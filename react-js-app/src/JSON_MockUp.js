
let titles, authors, ref_types, chars;

titles = `The Iliad;The Hobbit;1984;Pride and Prejudice;To Kill a Mockingbird;The Da Vinci Code;The Catcher in the Rye;Life of Pi;The Two Towers;Harry Potter and the Goblet of Fire`;
authors = `Homer;J. R. R. Tolkien;George Orwell;Jane Austen;Harper Lee;Dan Brown;J. D. Salinger;Yann Martel;J. R. R. Tolkien;J. K. Rowling`.split(';');
ref_types=['required', 'recommended'];
chars = '01234abcdefghijklmnopqrstuvwxyz56789'.split('');


export default function Gen_JSON_Mockup()
{

  let JSON_MockUp = [],
      _titles = titles.split`;`, _authors = authors,
      randTitles = [], randAuthors = [],
      randTitle, randIndex;

  randTitles = titles.split`;`.map((title, i) =>
  {
    randIndex = Math.floor(Math.random() * _titles.length);
    randTitle = _titles[randIndex];
    randAuthors.push(_authors[randIndex]);
    _titles.splice(randIndex, 1);
    _authors.splice(randIndex, 1);
    return randTitle;
  });

  JSON_MockUp = randTitles.map((title, i) => 
  {
    let id = chars.map((a, len) => len < 11 ? chars[Math.floor(Math.random() * chars.length)] : '').join(''),
        rand_int = Math.ceil(Math.random() * 8) + 2;  //used just for randomizing the number of displayed required and recommended refs 

    return {
      title: title,
      author: authors[i],
      id: id,
      ref_type: rand_int % i === 0 ? ref_types[0] : ref_types[1]
    }
  });

  return JSON_MockUp;
}
