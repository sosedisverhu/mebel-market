export default function getPartner (body) {
    const { id, texts, hidden } = body;

    return {
        id,
        texts,
        hidden
    };
}
