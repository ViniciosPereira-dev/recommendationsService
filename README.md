Microsserviço de Recomendação de Livros
 
Descrição:
Este microsserviço é responsável por recomendar livros com base no gênero informado pelo usuário durante a requisição.
As recomendações são feitas com base nos livros cadastrados na plataforma de doação, considerando apenas aqueles que estão disponíveis.

Regras de Negócio:
 
Cada livro possui um status:
DISPONÍVEL → pode ser recomendado
SOLICITADO → já possui interesse manifestado por algum usuário
CANCELADO → doação cancelada pelo doador
DOADO → livro já foi doado

O sistema:
Filtra livros pelo gênero informado
Retorna apenas livros com status DISPONIVEL
Apresenta os resultados em ordem aleatória

GET /recomendacoes?genero={genero}
 
Exemplo:
GET /recomendacoes?genero=ficcao
 
Resposta:
[
  "Duna",
  "1984"
]


 
 
 
