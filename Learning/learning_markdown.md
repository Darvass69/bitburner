## Math

<!-- ctrl + M for math-->

$deeznuts$


<!-- ----------------------- Headers ----------------------- -->
<!--ctrl + Shift + [ -> upLevel
    ctrl + Shift + ] -> downLevel-->






# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Paragraph

<!-- to make a paragraph, add a blank line -->

This is the first paragraph

This is another paragraph

## Emphasis

<!--ctrl + B for bold
    ctrl + I for italic
    for both, italic then bold -->

This is **bold**. This is in _italics_. This has **_both_**.

## Blockquote

> This is a blockquote
>
> With multiple lines
>
> > And nested
> >
> > With other features like **bold**

## List

1. This is an ordered list
2. It goes up
   1. You can also indent it
3. Three

- This is an unordered list
- There is no numbers
  - You can also indent it

\- you can use a \ to make sure some character still show up

## Code

`This is a code line`

```javascript
// This is a code block
function Markdown(colored) {
  if (colored == true) {
    return "This is colored!";
  }
}
```

## Horizontal rule

this creates

---

an horizontal rule

## Links

[This is a link to markdown guide](https://www.markdownguide.org/basic-syntax/ "Hover for a title!!!")

### And reference-style links

[This is a reference link][label]

[label]: https://github.com/Darvass69/bitburner "to my github :)"

### And images

[![Image][1]][2]

[1]: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png "This is an image with a link to wikipedia"
[2]: https://en.wikipedia.org/wiki/Image

## Does HTML work?

<em>If this is italicized, then it works</em>

## Tables

<!-- Alt + shift + f to format tables-->

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here’s this |
| Paragraph |    Text     |    And more |

## Footnotes

Here's a simple footnote,[^1] and here's a longer one.[^BigNote]

[^1]: This is the first footnote.

[^BigNote]: Here's one with multiple paragraphs and code
    Indent paragraphs to include them in the footnote.
    Add as many paragraphs as you like.

## Linking headings

You can link headings, take the heading, lower case, and replace spaces with "-" [like this.](#heading-1 "Heading 1")

## Definition lists

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

## Strikethrough
<!-- Alt + s for strikethrough -->

~~Hello World~~

## Task lists
<!-- Alt + c to check a box -->

- [x] 1
- [x] 2
- [ ] 3
- [x] 4

## Emoji

Never use emojis. Don't. Just don't.

## Highlight

Can you highlight ==this?==

## Subscript and superscript

Can you use ~subscript~ and ^superscript^?

## Hacks: some dubious things to be able to do more

### Underline

Some of these words <ins>will be underlined</ins>.

### Indent paragraph

&nbsp;&nbsp;&nbsp;&nbsp;This is the first sentence of my indented paragraph.

### Center text

<p style="text-align:center">Center this text</p>

### Color text

<p style="color:blue">Make this text blue.</p>

### Admonitions

> :warning: **Warning:** Do not push the big red button.
> :memo: **Note:** Sunrises are beautiful.
> :bulb: **Tip:** Remember to appreciate the little things in life.

### Image

#### Size

<img src="https://cdn.eso.org/images/screen/eso1907a.jpg" width="200" height="100">

#### With caption

<figure>
    <img src="https://cdn.eso.org/images/screen/eso1907a.jpg"
         alt="Black hole"
         width="200" height="100">
    <figcaption>It's a black hole</figcaption>
</figure>

### Link target

<a href="https://www.markdownguide.org" target="_blank">Learn Markdown!</a>


