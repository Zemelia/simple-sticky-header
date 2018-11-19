Simple Sticky Table Header
==================
Simple Sticky Table Header plugin. Vanilla JS.


Usage
-----
```js
    // Simple table:
    const table = document.getElementById('table');
    stickyHeader(table);

    // With scroll parent:
    const parent = document.getElementById('main');
    [].forEach.call(parent.querySelectorAll('table'), (el) => {
      stickyHeader(el, {scrollParent: parent})
    });
```

### Params
#### `table`
Table element.
#### Options

Object with options.
##### `scrollParent`
Scroll parent element. Optional, document.body is default.

##### `mode`
Sticky table mode, can be applied as horizontal or vertical (left columns sticked) or for both.
Vertical sticky column applicable only to first N columns with cells as `<th>` in tbody.
Possible modes are 'horizontal', 'vertical', 'both'.
Default: 'horizontal'.

##### `noWrapper`
Don't wrap table in extra element. If TRUE it will use existing one.
Default: false
