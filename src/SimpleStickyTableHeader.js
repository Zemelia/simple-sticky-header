/**
 * Simple sticky header plugin.
 *
 * @param table
 *   Table element.
 * @param options
 *   Object with options.
 */
function stickyTableHeader(table, inputOptions = {}) {
  const defaults = {
    scrollParent: document.body,
    mode: 'horizontal',
    noWrapper: false
  };

  const options = Object.assign({}, defaults, inputOptions);
  const isHorizontal = ['horizontal', 'both'].indexOf(options.mode) > -1;
  const isVertical = ['vertical', 'both'].indexOf(options.mode) > -1;

  if (!table) {
    return;
  }
  const thead = table.getElementsByTagName('thead')[0];
  const tbody = table.getElementsByTagName('tbody')[0];

  if (!tbody) {
    return;
  }
  if (!thead && !isVertical) {
    return;
  }

  const headerCells = thead.getElementsByTagName('th');

  let resizeTimeout = null;
  let sticked = false;
  let stickyTableHorizontal = null;
  let stickyTableThead = null;
  let stickyTableVertical = null;
  let widthModifier = 0;
  let stickyHeadTimeout = null;
  let stickyColTimeout = null;
  let stickyTableWrapper = null;
  let stickyTableVerticalHead = null;

  function setWidth(timeout = 300, initial = false) {
    // Function to apply sticky table width, etc.
    function applyWidth() {
      // Set sticky table head width with modifier to prevent cells misalignment.
      const theadWidth = thead.offsetWidth + widthModifier;

      // Reset previous styles.
      table.style.width = null;
      stickyTableThead = stickyTableHorizontal.getElementsByTagName('thead')[0];
      if (stickyTableThead) {
        stickyTableThead.style.width = null;
      }
      if (stickyTableHorizontal) {
        stickyTableHorizontal.style.width = null;
        [].forEach.call(stickyHeaderCells, (cell, key) => {
          cell.style.width = null;
        });
      }

      [].forEach.call(headerCells, (cell, key) => {
        const computedCellStyle = window.getComputedStyle(cell);
        const cellWidth = parseFloat(computedCellStyle.getPropertyValue('width'));
        stickyHeaderCells[key].style.width = `${cellWidth}px`;
        if (headerCells[key] && !cell.getAttribute('data-width')) {
          headerCells[key].style.width = `${cellWidth}px`;
        }
      });
      stickyTableThead.style.width = `${theadWidth}px`;

      // Fix alignment in some cases.
      try {
        if (
          table.parentNode.offsetWidth > tbody.offsetWidth &&
          stickyTableHorizontal.offsetWidth < table.offsetWidth
        ) {
          const style = {
            display: stickyTableHorizontal.style.display,
            position: stickyTableHorizontal.style.position
          };
          stickyTableHorizontal.style.display = null;
          stickyTableHorizontal.style.position = null;
          // table.style.width = `${stickyTableHorizontal.offsetWidth}px`;
          stickyTableHorizontal.style.display = style.display;
          stickyTableHorizontal.style.position = style.position;
        }
      } catch (error) {}
      // Set sticky table dynamic styles.
      stickyTableHorizontal.style.width = `${table.offsetWidth}px`;
      stickyTableHorizontal.style.left = `${tableBox.left}px`;
      stickyTableHorizontal.style.top = `${parentBox.top}px`;
      stickyTableThead.style.display = theadWidth > table.offsetWidth ? 'block' : null;
      scrollEventListener();
    }
    clearTimeout(stickyHeadTimeout);

    const parentBox = options.scrollParent.getBoundingClientRect();
    const stickyHeaderCells = stickyTableHorizontal.getElementsByTagName('th');
    const tableBox = stickyTableWrapper.getBoundingClientRect();

    // Refresh table cells width in case window resize, etc.
    [].forEach.call(headerCells, cell => {
      if (initial && cell.style.width) {
        cell.setAttribute('data-width', cell.style.width);
      } else if (!cell.getAttribute('data-width')) {
        cell.style.width = null;
      }
    });
    applyWidth();
    stickyHeadTimeout = setTimeout(() => {
      applyWidth();
    }, timeout);
  }

  function prepareHeader() {
    const clonedThead = thead.cloneNode(true);
    // Get border width as modifier to prevent misalignment with cells.
    widthModifier = headerCells[0] ? headerCells[0].offsetWidth - headerCells[0].clientWidth : 0;
    stickyTableHorizontal = document.createElement('table');

    // Set base styles for sticky table.
    Object.assign(stickyTableHorizontal.style, {
      position: 'fixed',
      overflow: 'hidden',
      display: 'none',
      // pointerEvents: 'none',
      zIndex: 2
    });
    stickyTableHorizontal.classList.add('sticky-table');

    // Set base styles for sticky table's head.
    clonedThead.style.transition = 'none';

    stickyTableHorizontal.appendChild(clonedThead);

    table.parentNode.appendChild(stickyTableHorizontal);
    setWidth(300, true);
  }

  function setColumnWidth(timeout = 300) {
    if (stickyTableVertical) {
      function setCorrectDimension(rows, parent) {
        [].forEach.call(rows, (tr, rowKey) => {
          [].forEach.call(tr.children, (cell, cellKey) => {
            if (parent.children[rowKey] && parent.children[rowKey].children[cellKey]) {
              const computedCellStyle = window.getComputedStyle(
                parent.children[rowKey].children[cellKey]
              );
              cell.style.width = `${parseFloat(computedCellStyle.getPropertyValue('width'))}px`;
              cell.style.height = `${parseFloat(computedCellStyle.getPropertyValue('height'))}px`;
            }
          });
        });
      }
      clearTimeout(stickyColTimeout);

      stickyColTimeout = setTimeout(() => {
        const headRows = stickyTableVertical.querySelectorAll('thead tr');
        const bodyRows = stickyTableVertical.querySelectorAll('tbody tr');
        setCorrectDimension(headRows, thead);
        setCorrectDimension(bodyRows, tbody);
      }, timeout);
    }
  }

  function prepareFixedColumn() {
    if (!tbody.getElementsByTagName('th').length) {
      return;
    }
    stickyTableVertical = document.createElement('table');
    stickyTableVertical.classList.add('sticky-table-vertical');
    const stickyTableVerticalBody = document.createElement('tbody');
    const bodyTRs = tbody.getElementsByTagName('tr');
    let cols = 0;
    while (bodyTRs[0].children[cols].nodeName.toLowerCase() === 'th') {
      cols++;
    }
    if (cols) {
      function generateRows(rows, rowsContainer) {
        [].forEach.call(rows, row => {
          const newTr = document.createElement('tr');
          for (let i = 0; i < cols; i++) {
            const col = row.children[i];
            if (col) {
              newTr.appendChild(col.cloneNode(true));
            }
          }
          rowsContainer.appendChild(newTr);
        });
      }
      generateRows(tbody.getElementsByTagName('tr'), stickyTableVerticalBody);
      if (thead) {
        stickyTableVerticalHead = document.createElement('thead');
        generateRows(thead.getElementsByTagName('tr'), stickyTableVerticalHead);
        Object.assign(stickyTableVerticalHead.style, {
          left: 0,
          top: 0,
          transition: 'none'
        });
        stickyTableVertical.appendChild(stickyTableVerticalHead);
      }
      stickyTableVertical.appendChild(stickyTableVerticalBody);
    }
    Object.assign(stickyTableVertical.style, {
      position: 'absolute',
      top: thead ? `${getTheadOffset()}px` : 0,
      left: 0,
      margin: 0,
      zIndex: 3,
      display: 'none',
      overflow: 'visible',
      transition: 'none'
    });

    table.parentNode.appendChild(stickyTableVertical);
    setColumnWidth();
  }

  function getTheadOffset() {
    let theadOffset = thead ? thead.offsetTop : 0;
    // Check if it's caption and it has greater height than thead top offset.
    if (theadOffset > 0) {
      const caption = table.querySelector('caption');
      if (caption) {
        const captionStyle = window.getComputedStyle(caption);
        const captionHeight = parseFloat(captionStyle.getPropertyValue('height'));
        if (captionHeight > theadOffset) {
          theadOffset = captionHeight;
        }
      }
    }
    return theadOffset;
  }

  function scrollEventListener() {
    const offsetTop = stickyTableWrapper.offsetTop;
    const bottomStickOffset = offsetTop + table.offsetHeight - thead.offsetHeight;
    const topStickOffset = offsetTop - options.scrollParent.scrollTop;
    let theadOffset = getTheadOffset();
    if (
      topStickOffset + theadOffset < 0 &&
      bottomStickOffset + theadOffset > options.scrollParent.scrollTop
    ) {
      sticked = true;
      stickyTableHorizontal.style.display = null;
      if (table.scrollLeft !== stickyTableHorizontal.scrollLeft) {
        stickyTableHorizontal.scrollLeft = table.scrollLeft;
      }

      if (stickyTableVerticalHead) {
        stickyTableVertical.style.paddingTop = `${thead.offsetHeight}px`;
        stickyTableVertical.classList.add('head-sticked');
        Object.assign(stickyTableVerticalHead.style, {
          transform: `translate3d(0px, ${Math.abs(topStickOffset) - theadOffset}px, 0px)`,
          position: 'absolute'
        });
      }
    }
    if (
      sticked === true &&
      (topStickOffset > 0 || bottomStickOffset < options.scrollParent.scrollTop)
    ) {
      sticked = false;
      stickyTableHorizontal.style.display = 'none';
      if (stickyTableVerticalHead) {
        stickyTableVertical.style.paddingTop = null;
        stickyTableVertical.classList.remove('head-sticked');
        Object.assign(stickyTableVerticalHead.style, {
          transform: null,
          position: null
        });
      }
    }
  }

  if (!options.noWrapper) {
    stickyTableWrapper = document.createElement('div');
    stickyTableWrapper.classList.add('sticky-table-wrapper');
    table.parentNode.insertBefore(stickyTableWrapper, table);
    stickyTableWrapper.appendChild(table);
  }
  else {
    stickyTableWrapper = table.parentNode;
  }
  if (stickyTableWrapper) {
    stickyTableWrapper.style.position = 'relative';
  }

  // Prepare header with base styles and html.
  if (isHorizontal && thead) {
    prepareHeader();
  }

  // Prepare vertical sticky column.
  if (isVertical && tbody) {
    prepareFixedColumn();
  }
  // Start listen for parent scroll.
  options.scrollParent.addEventListener('scroll', scrollEventListener);

  // Table scroll event, to have same scrollLeft position for sticky table based on parent one.
  table.addEventListener('scroll', () => {
    stickyTableHorizontal.scrollLeft = table.scrollLeft;
    // Scroll event handler for vertical sticky table if exists.
    if (stickyTableVertical) {
      if (table.scrollLeft) {
        stickyTableVertical.style.display = null;
      } else {
        stickyTableVertical.style.display = 'none';
      }
    }
  });

  // Resize with debounce to update widths.
  function resizeDebounce(e) {
    const timeout = e.detail && e.detail.timeout ? e.detail.timeout : 500;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setWidth();
      setColumnWidth();
    }, timeout);
  }
  window.addEventListener('resize', resizeDebounce);
}

export default stickyTableHeader;
