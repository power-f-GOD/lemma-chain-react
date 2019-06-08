
let titles, authors, ref_types, chars;

titles = `The Iliad;The Hobbit;1984;Pride and Prejudice;To Kill a Mockingbird;The Da Vinci Code;The Catcher in the Rye;Life of Pi;The Two Towers;Harry Potter and the Goblet of Fire;Outlander;Never Let Me Go;Digital Fortress;A Christmas Carol;Zen and the Art of Motorcycle Maintenance;Tess of the d'Urbervilles;The Divine Comedy;The Thirteenth Tale;To the Lighthouse;The Sea of Monsters`;
authors = `Homer;J. R. R. Tolkien;George Orwell;Jane Austen;Harper Lee;Dan Brown;J. D. Salinger;Yann Martel;J. R. R. Tolkien;J. K. Rowling;Diana Gabaldon;Kazuo Ishiguro;Dan Brown;Charles Dickens;Robert M. Pirsig;Thomas Hardy;Dante Alighieri;Diane Setterfield;Virginia Woolf;Rick Riordan`;
ref_types=['required', 'recommended'];
chars = '01234abcdefghijklmnopqrstuvwxyz56789'.split('');


export default function Gen_JSON_Mockup()
{

  let JSON_MockUp = [],
      _titles = titles.split`;`,
      _authors = authors.split`;`,
      randTitles = [], randAuthors = [],
      randTitle, randIndex;

  randTitles = titles.split`;`.map((title, i) =>
  {
    if (i > 7) return null;

    randIndex = Math.floor(Math.random() * _titles.length);
    randTitle = _titles[randIndex];
    randAuthors.push(_authors[randIndex]);
    _titles.splice(randIndex, 1);
    _authors.splice(randIndex, 1);
    return randTitle;
  }).filter((randTitle) => randTitle !== null);


  JSON_MockUp = randTitles.map((title, i) => 
  {
    let id = chars.map((a, len) => len < 11 ? chars[Math.floor(Math.random() * chars.length)] : '').join(''),
        rand_int = Math.ceil(Math.random() * _titles.length);  //used just for randomizing the number of displayed required and recommended refs 

    return {
      title: title,
      author: randAuthors[i],
      id: id,
      ref_type: rand_int % i === 0 ? ref_types[0] : ref_types[1]
    }
  });

  return JSON_MockUp;
}
