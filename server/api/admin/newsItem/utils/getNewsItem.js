export default function getNewsItem (body) {
    const { id, texts, avatar, files, youTubeVideo, hidden, date, alias } = body;

    return {
        id,
        texts,
        avatar,
        files,
        youTubeVideo,
        hidden,
        date,
        alias
    };
}
