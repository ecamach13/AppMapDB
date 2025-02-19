# hello

this is a test markdown file

<details>
  <summary>
    hello
  </summary>
  **hello**
</details>

---

It's very easy to make some words **bold** and other words *italic* with Markdown. You can even [link to Google!](http://google.com)

---

Sometimes you want numbered lists:

1. One
2. Two
3. Three

Sometimes you want bullet points:

* Start a line with a star
* Profit!

Alternatively,

- Dashes work just as well
- And if you have sub points, put two spaces before the dash or star:
  - Like this
  - And this

---

External image
<img src= "https://media.vanityfair.com/photos/5dd70131e78810000883f587/7:3/w_1953,h_837,c_limit/baby-yoda-craze.jpg" width="400px"/>

---

Image from this projects /public directory.  If you add an image to the /public directory, it will be available via the mindapps.org domain

<img src= "https://mindapps.org/apple_test.png" />

---


Video link in markup

[![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg)](https://www.youtube.com/watch?v=KOxbO0EI4MA "Audi R8")

---

Video link in markup (new window)

<a href="https://www.youtube.com/watch?v=KOxbO0EI4MA" target="_blank">[![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg)]</a>

---

Manual link

<a href="https://www.youtube.com/watch?v=KOxbO0EI4MA" target="_blank">Hello, world!</a>

---

# Structured documents

Sometimes it's useful to have different levels of headings to structure your documents. Start lines with a `#` to create headings. Multiple `##` in a row denote smaller heading sizes.

### This is a third-tier heading

You can use one `#` all the way up to `######` six for different heading sizes.

If you'd like to quote someone, use the > character before the line:

> Coffee. The finest organic suspension ever devised... I beat the Borg with it.
> - Captain Cook

---

There are many different ways to style code with GitHub's markdown. If you have inline code blocks, wrap them in backticks: `var example = true`.  If you've got a longer block of code, you can indent with four spaces:

    if (isAwesome){
      return true
    }

GitHub also supports something called code fencing, which allows for multiple lines without indentation:

```
if (isAwesome){
  return true
}
```

And if you'd like to use syntax highlighting, include the language:

```javascript
if (isAwesome){
  return true
}
```
