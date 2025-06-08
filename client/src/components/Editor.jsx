import React from 'react'
function Editor() {
    return (
        <Editor
            apiKey='vozz37oglxtex3x0b70pfc9e8my37piiobbd4yqfqzs6t71e'
            onInit={(_evt, editor) => editorRef.current = editor}
            initialValue={slide.content}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    )
}

export default Editor