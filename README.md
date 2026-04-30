# CineTrack

> Plataforma React para descoberta de filmes e series usando a TMDB API

## Screenshots
[inserir prints aqui]

## Arquitetura
[inserir diagrama de pastas ou fluxo de rotas aqui]

## Tecnologias
- React + Vite
- React Router DOM v6
- Axios
- CSS Modules
- TMDB API (themoviedb.org)

## Variaveis de Ambiente

Crie um arquivo `.env` na raiz:

```
VITE_TMDB_KEY=sua_chave_aqui
```

Obtenha sua chave gratuita em: https://www.themoviedb.org/settings/api

## Como instalar e rodar

```bash
git clone https://github.com/SEU_USUARIO/cinetrack.git
cd cinetrack
npm install
npm run dev
```

## Acesse online
[link do deploy aqui]

## Estrutura do projeto
[copiar a estrutura de pastas aqui]

## Rotas
| Rota | Descricao |
|------|-----------|
| `/` | Home / Landing page |
| `/filmes` | Catalogo de filmes |
| `/series` | Catalogo de series |
| `/filme/:id` | Detalhes do filme (rota dinamica) |
| `/serie/:id` | Detalhes da serie (rota dinamica) |
| `/buscar` | Resultados de busca |
