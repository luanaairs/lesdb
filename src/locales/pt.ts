
import type { Translations } from '@/types';

export const pt: Translations = {
  appName: "LESDB",
  tagline: "Banco de Dados de Filmes Sáficos",
  searchPlaceholder: "Buscar filmes, atrizes, diretoras...",
  filterBy: "Filtrar por",
  releaseYear: "Ano de Lançamento",
  country: "País",
  language: "Idioma",
  tags: "Tags",
  all: "Todos",
  allCountries: "Todos os Países",
  allLanguages: "Todos os Idiomas",
  resetFilters: "Limpar Filtros",
  sortBy: "Ordenar por",
  sortOptions: {
    titleAsc: "Título (A-Z)",
    titleDesc: "Título (Z-A)",
    yearNewest: "Ano (Mais Novo)",
    yearOldest: "Ano (Mais Antigo)",
    imdbHighest: "Nota IMDb (Maior)",
    imdbLowest: "Nota IMDb (Menor)",
  },
  availability: "Disponível em",
  watchOn: "Assistir em",
  availabilityCountry: "Região da Disponibilidade",
  noMoviesFound: "Nenhum filme encontrado com seus critérios.",
  noMoviesFoundForIDs: "Parece que o TMDB não retornou filmes para os IDs especificados ou eles foram filtrados. Verifique sua chave da API do TMDB em <code>.env.local</code>, certifique-se de que o servidor foi reiniciado e inspecione os logs do console do servidor para \"Raw data from TMDB\".",
  loadingMoreMovies: "Carregando mais filmes...",
  loadingMovies: "Carregando filmes...",
  selectLanguage: "Selecionar Idioma",
  english: "English",
  portuguese: "Português (Brasil)",
  showFilters: "Mostrar Filtros",
  hideFilters: "Esconder Filtros",
  includeExplicitContent: "Incluir Conteúdo Explícito",
  movieCard: {
    year: "Ano",
    countries: "Países",
    languages: "Idiomas",
    tags: "Gêneros",
    director: "Direção",
    description: "Descrição",
  },
  tmdbError: "Opa! Não foi possível buscar os filmes do TMDB.",
  tmdbErrorSuggestion: "Exibindo filmes de exemplo. Verifique sua chave da API do TMDB ou tente novamente mais tarde.",
  pagination: {
    previousPage: "Página Anterior",
    nextPage: "Próxima Página",
    pageInfo: "Página {{currentPage}} de {{totalPages}}",
  },
  countries: {
    USA: "EUA",
    US: "Estados Unidos",
    Brazil: "Brasil",
    BR: "Brasil",
    Canada: "Canadá",
    CA: "Canadá",
    UK: "Reino Unido",
    GB: "Reino Unido",
    France: "França",
    FR: "França",
    Germany: "Alemanha",
    DE: "Alemanha",
    Spain: "Espanha",
    ES: "Espanha",
    Argentina: "Argentina",
    AR: "Argentina",
    SouthKorea: "Coreia do Sul",
    KR: "Coreia do Sul",
    Sweden: "Suécia",
    SE: "Suécia",
    Australia: "Austrália",
    AU: "Austrália",
    Belgium: "Bélgica",
    BE: "Bélgica",
    Kenya: "Quênia",
    KE: "Quênia",
    SouthAfrica: "África do Sul",
    ZA: "África do Sul",
    Norway: "Noruega",
    NO: "Noruega",
    Lebanon: "Líbano",
    LB: "Líbano",
    Netherlands: "Holanda",
    NL: "Holanda",
    JP: "Japão",
    CN: "China",
  },
  languages: {
    English: "Inglês",
    EN: "Inglês",
    Portuguese: "Português",
    PT: "Português",
    Spanish: "Espanhol",
    ES: "Espanhol",
    French: "Francês",
    FR: "Francês",
    German: "Alemão",
    DE: "Alemão",
    Korean: "Coreano",
    KO: "Coreano",
    Swedish: "Sueco",
    SV: "Sueco",
    Mandarin: "Mandarim",
    ZH: "Mandarim",
    Japanese: "Japonês",
    JA: "Japonês",
    Swahili: "Suaíli",
    SW: "Suaíli",
  },
  movieTags: {
    "Action": "Ação",
    "Adventure": "Aventura",
    "Animation": "Animação",
    "Comedy": "Comédia",
    "Crime": "Crime",
    "Documentary": "Documentário",
    "Drama": "Drama",
    "Family": "Família",
    "Fantasy": "Fantasia",
    "History": "História",
    "Horror": "Terror",
    "Music": "Música",
    "Mystery": "Mistério",
    "Romance": "Romance",
    "Science Fiction": "Ficção Científica",
    "TV Movie": "Filme para TV",
    "Thriller": "Suspense",
    "War": "Guerra",
    "Western": "Faroeste",
    "Explicit": "Explícito (18+)",
  },
  platforms: {
    Netflix: "Netflix",
    PrimeVideo: "Prime Video",
    AppleTV: "Apple TV+",
    DisneyPlus: "Disney+",
    Max: "Max",
    ParamountPlus: "Paramount+",
    Hulu: "Hulu",
    Mubi: "Mubi",
    Peacock: "Peacock",
    Globoplay: "Globoplay",
    StarPlus: "Star+",
    ClaroVideo: "Claro video",
    Looke: "Looke",
    Telecine: "Telecine",
    Other: "Outro",
  },
  about: "Sobre",
  aboutPageTitle: "Sobre o LESDB",
  aboutPageParagraph1: "LESDB é um banco de dados de filmes sáficos desenvolvido para compilar, em formato acessível, filmes que retratam histórias sáficas, sejam relacionamentos entre mulheres ou mesmo histórias em que personagens-chave são mulheres lésbicas, bissexuais e pansexuais.",
  aboutPageParagraph2: "Este projeto é um trabalho de amor e nasceu da necessidade de se ver na tela - e da triste constatação de quão difícil é encontrar histórias que ressoem. O site que você está acessando foi desenvolvido usando bibliotecas e APIs de código aberto, incluindo TMDB e OMDB para dados de filmes. Se você tiver interesse em dizer 'obrigado', sinta-se à vontade para me pagar um café via ko-fi :)",
  suggest: "Sugerir",
  suggestFilmPageTitle: "Sugerir um Filme",
  suggestForm: {
    movieNameLabel: "Nome do Filme",
    movieNamePlaceholder: "Digite o título original do filme",
    linksLabel: "Links Relevantes",
    linksPlaceholder: "ex: URLs do Letterboxd, IMDb, Wikipedia (um por linha)",
    tmdbIdLabel: "ID do TMDB (Opcional)",
    tmdbIdPlaceholder: "ex: 530385",
    reasonLabel: "Motivo da Sugestão (Opcional)",
    reasonPlaceholder: "Por que este filme deveria estar no LESDB?",
    submitButton: "Enviar Sugestão",
    suggestionThanksTitle: "Sugestão Recebida!",
    suggestionThanksDescription: "Obrigado pela sua sugestão. Ela será analisada.",
    suggestionErrorTitle: "Erro no Envio",
    suggestionErrorDescription: "Não foi possível enviar a sugestão. Por favor, tente novamente.",
  },
};

    