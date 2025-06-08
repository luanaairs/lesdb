
import type { Movie } from '@/types';
import { Film } from 'lucide-react';

export const sampleMovies: Movie[] = [
  {
    id: '1',
    title: { en: 'Portrait of a Lady on Fire', pt: 'Retrato de uma Jovem em Chamas' },
    posterUrl: 'https://placehold.co/300x450/D52D00/FFF.png?text=PoaLoF',
    releaseYear: 2019,
    countries: ['FR'], // France
    languages: ['FR'], // French
    tags: ['periodDrama', 'romance', 'slowBurn', 'sapphic'],
    director: { en: 'Céline Sciamma', pt: 'Céline Sciamma' },
    actors: [{ en: 'Noémie Merlant', pt: 'Noémie Merlant' }, { en: 'Adèle Haenel', pt: 'Adèle Haenel' }],
    description: {
      en: 'On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman.',
      pt: 'Em uma ilha isolada na Bretanha no final do século XVIII, uma pintora é obrigada a pintar o retrato de casamento de uma jovem.'
    },
    availability: [
      { platform: 'Hulu', url: '#' },
      { platform: 'Mubi', url: '#' },
    ],
    imdbRating: 8.1,
    letterboxdUrl: 'https://letterboxd.com/film/portrait-of-a-lady-on-fire/',
    tmdbId: 530385,
  },
  {
    id: '2',
    title: { en: 'Carol', pt: 'Carol' },
    posterUrl: 'https://placehold.co/300x450/B55690/FFF.png?text=Carol',
    releaseYear: 2015,
    countries: ['GB', 'US'], // UK, USA
    languages: ['EN'], // English
    tags: ['periodDrama', 'romance', 'basedOnBook', 'forbiddenLove', 'sapphic'],
    director: { en: 'Todd Haynes', pt: 'Todd Haynes' },
    actors: [{ en: 'Cate Blanchett', pt: 'Cate Blanchett' }, { en: 'Rooney Mara', pt: 'Rooney Mara' }],
    description: {
      en: 'An aspiring photographer develops an intimate relationship with an older woman in 1950s New York.',
      pt: 'Uma aspirante a fotógrafa desenvolve um relacionamento íntimo com uma mulher mais velha na Nova York dos anos 1950.'
    },
    availability: [
      { platform: 'Netflix', url: '#' },
      { platform: 'PrimeVideo', url: '#' },
    ],
    imdbRating: 7.2,
    letterboxdUrl: 'https://letterboxd.com/film/carol/',
    tmdbId: 297253,
  },
  {
    id: '3',
    title: { en: 'The Handmaiden', pt: 'A Criada' },
    posterUrl: 'https://placehold.co/300x450/D52D00/FFF.png?text=Handmaiden',
    releaseYear: 2016,
    countries: ['KR'], // South Korea
    languages: ['KO', 'JA'], // Korean, Japanese
    tags: ['periodDrama', 'explicit', 'drama', 'basedOnBook', 'sapphic'],
    director: { en: 'Park Chan-wook', pt: 'Park Chan-wook' },
    actors: [{ en: 'Kim Min-hee', pt: 'Kim Min-hee' }, { en: 'Kim Tae-ri', pt: 'Kim Tae-ri' }],
    description: {
      en: 'A woman is hired as a handmaiden to a Japanese heiress, but secretly she is involved in a plot to defraud her.',
      pt: 'Uma mulher é contratada como criada para uma herdeira japonesa, mas secretamente ela está envolvida em um plano para fraudá-la.'
    },
    availability: [
      { platform: 'PrimeVideo', url: '#' },
    ],
    imdbRating: 8.1,
    letterboxdUrl: 'https://letterboxd.com/film/the-handmaiden/',
    tmdbId: 405774,
  },
  {
    id: '4',
    title: { en: 'Saving Face', pt: 'Livrando a Cara' },
    posterUrl: 'https://placehold.co/300x450/B55690/FFF.png?text=SavingFace',
    releaseYear: 2004,
    countries: ['US'], // USA
    languages: ['EN', 'ZH'], // English, Mandarin
    tags: ['comedy', 'romance', 'comingOfAge', 'sapphic'],
    director: { en: 'Alice Wu', pt: 'Alice Wu' },
    actors: [{ en: 'Michelle Krusiec', pt: 'Michelle Krusiec' }, { en: 'Lynn Chen', pt: 'Lynn Chen' }],
    description: {
      en: 'A Chinese-American lesbian and her traditional mother are reluctant to go public with secret loves that clash with cultural expectations.',
      pt: 'Uma lésbica sino-americana e sua mãe tradicional relutam em tornar públicos amores secretos que entram em conflito com as expectativas culturais.'
    },
    availability: [
      { platform: 'Other', url: '#' },
    ],
    imdbRating: 7.5,
    tmdbId: 14756,
  },
  {
    id: '5',
    title: { en: 'Blue Is the Warmest Color', pt: 'Azul é a Cor Mais Quente' },
    posterUrl: 'https://placehold.co/300x450/D52D00/FFF.png?text=BlueWarmest',
    releaseYear: 2013,
    countries: ['FR', 'BE', 'ES'], // France, Belgium, Spain
    languages: ['FR'], // French
    tags: ['comingOfAge', 'drama', 'romance', 'explicit', 'sapphic'],
    director: { en: 'Abdellatif Kechiche', pt: 'Abdellatif Kechiche' },
    actors: [{ en: 'Léa Seydoux', pt: 'Léa Seydoux' }, { en: 'Adèle Exarchopoulos', pt: 'Adèle Exarchopoulos' }],
    description: {
      en: "Adèle's life is changed when she meets Emma, a young woman with blue hair, who will allow her to discover desire and to assert herself as a woman and as an adult.",
      pt: "A vida de Adèle muda quando ela conhece Emma, uma jovem de cabelos azuis, que lhe permitirá descobrir o desejo e se afirmar como mulher e adulta."
    },
    availability: [
      { platform: 'Netflix', url: '#' },
    ],
    imdbRating: 7.7,
    letterboxdUrl: 'https://letterboxd.com/film/blue-is-the-warmest-color/',
    tmdbId: 106729,
  },
  {
    id: '6',
    title: { en: 'Ammonite', pt: 'Ammonite' },
    posterUrl: 'https://placehold.co/300x450/B55690/FFF.png?text=Ammonite',
    releaseYear: 2020,
    countries: ['GB', 'US', 'AU'], // UK, USA, Australia
    languages: ['EN'], // English
    tags: ['periodDrama', 'romance', 'drama', 'slowBurn', 'sapphic'],
    director: { en: 'Francis Lee', pt: 'Francis Lee' },
    actors: [{ en: 'Kate Winslet', pt: 'Kate Winslet' }, { en: 'Saoirse Ronan', pt: 'Saoirse Ronan' }],
    description: {
        en: '1840s England, acclaimed but overlooked fossil hunter Mary Anning and a young woman sent to convalesce by the sea develop an intense relationship, altering both of their lives forever.',
        pt: 'Inglaterra dos anos 1840, a aclamada, mas negligenciada, caçadora de fósseis Mary Anning e uma jovem enviada para convalescer à beira-mar desenvolvem um relacionamento intenso, alterando suas vidas para sempre.'
    },
    availability: [
        { platform: 'Hulu', url: '#' },
    ],
    imdbRating: 6.6,
    letterboxdUrl: 'https://letterboxd.com/film/ammonite/',
    tmdbId: 596161,
  },
  {
    id: '7',
    title: { en: 'Rafiki', pt: 'Rafiki' },
    posterUrl: 'https://placehold.co/300x450/D52D00/FFF.png?text=Rafiki',
    releaseYear: 2018,
    countries: ['KE', 'ZA', 'DE', 'NL', 'FR', 'NO', 'LB', 'GB'], // Kenya, South Africa, Germany, Netherlands, France, Norway, Lebanon, UK
    languages: ['SW', 'EN'], // Swahili, English
    tags: ['drama', 'romance', 'forbiddenLove', 'sapphic'],
    director: { en: 'Wanuri Kahiu', pt: 'Wanuri Kahiu' },
    actors: [{ en: 'Samantha Mugatsia', pt: 'Samantha Mugatsia' }, { en: 'Sheila Munyiva', pt: 'Sheila Munyiva' }],
    description: {
        en: 'Kena and Ziki long for something more. Despite the political rivalry between their families, the girls resist and remain close friends, supporting each other to pursue their dreams in a conservative society. When love blossoms between them, the two girls will be forced to choose between happiness and safety.',
        pt: 'Kena e Ziki anseiam por algo mais. Apesar da rivalidade política entre suas famílias, as meninas resistem e permanecem amigas íntimas, apoiando-se mutuamente para perseguir seus sonhos em uma sociedade conservadora. Quando o amor floresce entre elas, as duas meninas serão forçadas a escolher entre felicidade e segurança.'
    },
    availability: [
        { platform: 'Other', url: '#' },
    ],
    imdbRating: 6.8,
    letterboxdUrl: 'https://letterboxd.com/film/rafiki/',
    tmdbId: 512200,
  },
];
