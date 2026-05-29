import "dotenv/config";
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Recommendation Service running on http://localhost:${PORT}`);
});

app.get("/recommendation", async (req, res) => {
    try {
        const { genre } = req.query;

        // Faz a chamada pública na porta 3000
        const response = await axios.get("http://localhost:3000/books/");
        
        // Garante a extração correta do array de livros
        const books = response.data && response.data.data ? response.data.data : response.data;

        if (!books || !Array.isArray(books) || books.length === 0) {
            return res.json({
                message: "Nenhum livro disponível",
                book: null
            });
        }

        // Filtra os livros disponíveis
        let filteredBooks = books.filter((b) => b.status === "AVAILABLE");

        // Aplica o filtro de gênero se ele for enviado
        if (genre) {
            filteredBooks = filteredBooks.filter(
                (b) => b.genre && b.genre.toLowerCase() === genre.toLowerCase()
            );
        }

        if (filteredBooks.length === 0) {
            return res.json({
                message: "Nenhum livro encontrado para esse gênero",
                book: null
            });
        }

        // Sorteio aleatório
        const randomIndex = Math.floor(Math.random() * filteredBooks.length);
        const recommendedBook = filteredBooks[randomIndex];

        // RETORNO PROTEGIDO: Usamos o operador "||" e "?." para garantir que se o doador não existir, o código não quebre
        return res.json({
            message: "Livro recomendado com sucesso",
            book: {
                id: recommendedBook.id || null,
                title: recommendedBook.title || "Título Indisponível",
                author: recommendedBook.author || "Autor Desconhecido",
                genre: recommendedBook.genre || "Geral",
                description: recommendedBook.description || "",
                status: recommendedBook.status || "AVAILABLE"
            },
            owner: {
                id: recommendedBook.user ? recommendedBook.user.id : (recommendedBook.userId || null),
                name: recommendedBook.user ? recommendedBook.user.name : "Doador da Comunidade",
                phone: recommendedBook.user ? recommendedBook.user.phone : ""
            }
        });

    } catch (err) {
        // AJUSTE CRUCIAL: Agora o microsserviço vai cuspir no terminal dele o erro REAL do porquê está caindo aqui!
        console.error("====== ERRO INTERNO DO MICROSSERVIÇO ======");
        console.error("Mensagem exata:", err.message);
        if (err.response) {
            console.error("Dados da resposta com erro da API 3000:", err.response.data);
        }
        
        return res.status(500).json({
            error: "Erro ao buscar recomendação no microsserviço"
        });
    }
});
