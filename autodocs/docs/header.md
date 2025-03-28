**nanojs** is a lightweight, functional framework for building reactive web applications.

## Features

- Zero build step
- Reactive state management
- Declarative DOM creation and updates
- Utilities like `sleep`, `schedule`, `S()` selector, and more

## Example

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>nJS example</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nanoflite/nanojs@latest/nanojs.css"/>
    </head>
    <body>
        <script type="module">
            import { add, tags } from 'https://cdn.jsdelivr.net/gh/nanoflite/nanojs@latest/nanojs.mjs'
            const { h1 } = tags()
            add(document.body, h1('Hello World!'))
        </script>
    </body>
</html>
```
