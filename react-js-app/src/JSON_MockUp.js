
let titles = `Harry Potter and the Deathly Hallows;The Hobbit;1984;Pride and Prejudice;To Kill a Mockingbird;The Da Vinci Code;The Catcher in the Rye;Life of Pi;The Two Towers;Harry Potter and the Goblet of Fire`.split(';'),
    authors = `J. K. Rowling;J. R. R. Tolkien;George Orwell;Jane Austen;Harper Lee;Dan Brown;J. D. Salinger;Yann Martel;J. R. R. Tolkien;J. K. Rowling`.split(';'),
    ref_types=['required', 'recommended'],
    chars = '01234abcdefghijklmnopqrstuvwxyz56789'.split(''),
    JSON_MockUp = []
   

for (let i in titles)
{
  let id = chars.map((a, i) => i < 11 ? chars[Math.floor(Math.random() * chars.length)] : '').join('')
  
  JSON_MockUp.push(
  {
    title: titles[i],
    author: authors[i],
    id: id,
    ref_type: i % 5 === 0 ? ref_types[0] : ref_types[1]
  })
}


export default JSON_MockUp;
