class UploadImage {
    constructor ({ loader, handlers }) {
        this.loader = loader;
        this.handlers = handlers;
    }

    // Starts the upload process.
    upload () {
        return this.loader.file
            .then(file => {
                const formData = new FormData();
                formData.append(`editor-file`, file);

                return this.handlers.onUploadFile(formData)
                    .then(src => ({
                        default: src
                    }));
            });
    }
}

export default function UploadImagePlugin ({ handlers }) {
    return function (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadImage({ loader, handlers });
        };
    };
}
