export default function getPartner (body) {
    const { id, texts, hidden, alias } = body;

    return {
        id,
        texts,
        hidden,
        alias
    };
}
