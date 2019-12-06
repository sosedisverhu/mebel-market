export default function getArticle (body) {
    const { id, texts, hidden, date, alias } = body;

    return {
        id,
        texts,
        hidden,
        date,
        alias
    };
}
