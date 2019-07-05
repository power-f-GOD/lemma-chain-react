
let titles: string,
    authors: string,
    ref_types: string[],
    chars: string;

titles = `The Iliad;The Hobbit;1984;Pride and Prejudice;To Kill a Mockingbird;The Da Vinci Code;The Catcher in the Rye;Life of Pi;The Two Towers;Harry Potter and the Goblet of Fire;Outlander;Never Let Me Go;Digital Fortress;A Christmas Carol;Zen and the Art of Motorcycle Maintenance;Tess of the d'Urbervilles;The Divine Comedy;The Thirteenth Tale;To the Lighthouse;The Sea of Monsters`;
authors = `Homer;J. R. R. Tolkien;George Orwell;Jane Austen;Harper Lee;Dan Brown;J. D. Salinger;Yann Martel;J. R. R. Tolkien;J. K. Rowling;Diana Gabaldon;Kazuo Ishiguro;Dan Brown;Charles Dickens;Robert M. Pirsig;Thomas Hardy;Dante Alighieri;Diane Setterfield;Virginia Woolf;Rick Riordan`;
ref_types = ['required', 'recommended'];
chars = '01234abcdefghijklmnopqrstuvwxyz56789';


export function Gen_JSON_Mockup()
{

  let JSON_MockUp: object[],
      _titles: string[] = titles.split(';'),
      _authors: string[] = authors.split(';'),
      _chars: string[] = chars.split(''),
      randTitles: string[] = [],
      randAuthors: string[] = [],
      randTitle: string, randIndex: number;

  randTitles = titles.split(';').map((title, i) =>
  {
    if (i > 7) return '';           //retrict number of generated payload (titles) to 8 instead of 20 (which is the actual total number of books [payload/titles]) in order to well visualize randomization and see changes: PS: sum of the total number of required and recommended refs will always be 8

    randIndex = Math.floor(Math.random() * _titles.length);
    randTitle = _titles[randIndex];
    randAuthors.push(_authors[randIndex]);
    _titles.splice(randIndex, 1);
    _authors.splice(randIndex, 1);
    return randTitle;
  }).filter((randTitle) => randTitle !== '');


  JSON_MockUp = randTitles.map((title: string, i: number) => 
  {
    let id = _chars.map((a, len) => len < 11 ? chars[Math.floor(Math.random() * chars.length)] : '').join(''),
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


export default function Get_HardCoded_Refs()
{
  return (
    {
        "data": {
            "authors": [
                "J. D. Salinger",
                "Salinger"
            ],
            "title": "The Catcher in the Rye"
        },
        "id": "@powerofgod/17t8kcjuw",
        "refs": [
            {
                "data": {
                    "authors": [
                        "Dan Brown"
                    ],
                    "title": "The Da Vinci Code"
                },
                "id": "@powerofgod/myin9aksq",
                "ref_type": "required",
                "refs": []
            },
            {
                "data": {
                    "authors": [
                        "Jane Austen"
                    ],
                    "title": "Pride and Prejudice"
                },
                "id": "@powerofgod/r9t9rc4ip",
                "ref_type": "required",
                "refs": [
                    {
                        "data": {
                            "authors": [
                                "Dan Brown"
                            ],
                            "title": "The Da Vinci Code"
                        },
                        "id": "myin9aksq",
                        "ref_type": "required",
                        "refs": []
                    }
                ]
            },
            {
                "data": {
                    "authors": [
                        "Yann Martel"
                    ],
                    "title": "Life of Pi"
                },
                "id": "@johny/d2tm8cyi99",
                "ref_type": "recommended",
                "refs": [
                    {
                        "data": {
                            "authors": [
                                "Dan Brown"
                            ],
                            "title": "The Da Vinci Code"
                        },
                        "id": "myin9aksq",
                        "ref_type": "recommended",
                        "refs": []
                    },
                    {
                        "data": {
                            "authors": [
                                "Jane Austen"
                            ],
                            "title": "Pride and Prejudice"
                        },
                        "id": "r9t9rc4ip",
                        "ref_type": "required",
                        "refs": []
                    },
                    {
                        "data": {
                            "authors": [
                                "J. R. R. Tolkien"
                            ],
                            "title": "The Hobbit"
                        },
                        "id": "@johny/35t8qc8i5",
                        "ref_type": "required",
                        "refs": [
                            {
                                "data": {
                                    "authors": [
                                        "Dan Brown"
                                    ],
                                    "title": "The Da Vinci Code"
                                },
                                "id": "myin9aksq",
                                "ref_type": "recommended",
                                "refs": []
                            },
                            {
                                "data": {
                                    "authors": [
                                        "Jane Austen"
                                    ],
                                    "title": "Pride and Prejudice"
                                },
                                "id": "r9t9rc4ip",
                                "ref_type": "required",
                                "refs": []
                            }
                        ]
                    },
                    {
                        "data": {
                            "authors": [
                                "J. R. R. Tolkien"
                            ],
                            "title": "The Two Towers"
                        },
                        "id": "@johny/jjtn4cdirv",
                        "ref_type": "recommended",
                        "refs": [
                            {
                                "data": {
                                    "authors": [
                                        "Dan Brown"
                                    ],
                                    "title": "The Da Vinci Code"
                                },
                                "id": "myin9aksq",
                                "ref_type": "required",
                                "refs": []
                            },
                            {
                                "data": {
                                    "authors": [
                                        "Jane Austen"
                                    ],
                                    "title": "Pride and Prejudice"
                                },
                                "id": "r9t9rc4ip",
                                "ref_type": "required",
                                "refs": []
                            },
                            {
                                "data": {
                                    "authors": [
                                        "J. R. R. Tolkien"
                                    ],
                                    "title": "The Hobbit"
                                },
                                "id": "35t8qc8i5",
                                "ref_type": "recommended",
                                "refs": []
                            }
                        ]
                    }
                ]
            },
            
        ]
    }
  );
}



		// "required:@alpha/35t8qc8i5",
		// "required:@alpha/jjtn4cdirv",
		// "recommended:@alpha/17t8kc5ig",
		// "recommended:@alpha/qqt2kcrip2",
		// "recommended:@alpha/n8padhdu4"