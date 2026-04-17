# Differentia - Prototipo

App web (PWA) de jogos educativos baseados no **Metodo Lupa**. Mobile-first, feito para criancas de 6-10 anos.

## Estrutura

```
differentia/
├── index.html              (todas as telas)
├── style.css
├── game.js                 (logica dos 6 jogos + conteudo do Metodo Lupa)
├── manifest.json           (PWA)
├── service-worker.js       (cache offline)
├── icons/                  (adicionar icon-192.png e icon-512.png)
└── images/                 (colocar aqui os PNGs dos personagens)
    ├── leao.png, lobo.png, cobra.png, mosquito.png,
    ├── bajo.png, tina.png, panda.png, coruja.png,
    └── leco.png, arara.png
```

## Jogos incluidos

1. **Jogo da Memoria** - pares de personagens (preservado do original)
2. **Memoria Quiz** - pares de pergunta-resposta (preservado do original)
3. **Super Quiz** - 10 perguntas de multipla escolha embaralhadas
4. **Caca-Palavras** - grade 8x8 com nomes dos personagens
5. **Trilha da Jornada** - 12 casas com perguntas, recompensas e fim
6. **Sequencia Saudavel** - 4 cenarios ordenando Pensamento->Sentimento->Comunicacao->Atitude

## Onde editar o conteudo

No topo do **game.js**, secao `CONTEUDO DO METODO LUPA`:

- `classicCards` - personagens (nome + caminho da imagem)
- `quizCards` - perguntas e respostas do memoria-quiz
- `superQuizQuestions` - multipla escolha (4 opcoes, index da correta)
- `wordSearchWords` - palavras do caca-palavras (letras maiusculas, sem acento)
- `sequenceScenarios` - cenarios da Sequencia Saudavel
- `trailTiles` - casas da Trilha

As perguntas atuais foram inferidas do memoria-quiz que ja estava no codigo. Quando receber o PDF do livro, substitua pelo conteudo real.

## Como rodar localmente

Precisa de servidor HTTP pro service worker funcionar:

```bash
python3 -m http.server 8000
# ou: npx serve
# ou: php -S localhost:8000
```

Abra `http://localhost:8000` no celular na mesma rede (troque localhost pelo IP local).

## PWA

Pra instalar no celular:
1. Adicione `icons/icon-192.png` e `icons/icon-512.png`
2. Hospede em HTTPS
3. O navegador oferece "Instalar app"

## Proximos passos sugeridos

- Persistencia de progresso (localStorage) com estrelas totais e conquistas
- Escolha de personagem/avatar
- Sons/musica de fundo
- Modo pais com relatorio de progresso
- Integracao com differentia.world
