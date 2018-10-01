/**
 * Simple sticky header plugin.
 *
 * @param table
 *   Table element.
 * @param scrollParent
 *   Scroll parent element. Optional, document.body is default.
 */
function stickyTableHeader(table, scrollParent = document.body) {
  if (!table) {
    return;
  }
  const thead = table.getElementsByTagName('thead')[0];
  if (!thead) {
    return
  }
  const headerCells = thead.getElementsByTagName('th');
  let resizeTimeout = null;
  let sticked = false;
  let stickyTable = null;
  let widthModifier = 0;

  function setWidth() {
    const parentBox = scrollParent.getBoundingClientRect();
    const stickyHeaderCells =  stickyTable.getElementsByTagName('th');

    // Refresh table cells width in case window resize, etc.
    [].forEach.call(headerCells, (cell, key) => {
      cell.style.width = null;
    });

    [].forEach.call(headerCells, (cell, key) => {
      const computedCellStyle = window.getComputedStyle(cell);
      const cellWidth = parseFloat(computedCellStyle.getPropertyValue('width'));
      stickyHeaderCells[key].style.width = cellWidth + 'px';
      if (headerCells[key]) {
        headerCells[key].style.width = cellWidth + 'px';
      }
    });
    // Set sticky table head width with modifier to prevent cells missalignment.
    const computedTheadStyle = window.getComputedStyle(thead)
    const theadWidth = parseFloat(computedTheadStyle.getPropertyValue('width'));
    stickyTable.getElementsByTagName('thead')[0].style.width = (theadWidth + widthModifier) + 'px';
    // Set sticky table dynamic styles.
    stickyTable.style.width = table.offsetWidth + 'px';
    stickyTable.style.left = (table.offsetLeft + parentBox.left) + 'px';
    stickyTable.style.top = parentBox.top + 'px';
  }

  function prepareHeader() {
    const clonedThead = thead.cloneNode(true);
    // Get border width as modifier to prevent misalignment with cells.
    widthModifier = headerCells[0] ? headerCells[0].offsetWidth - headerCells[0].clientWidth : 0;
    stickyTable = document.createElement('table');

    // Set base styles for sticky table.
    stickyTable.style.position = 'fixed';
    stickyTable.style.overflow = 'hidden';
    stickyTable.style.display = 'none';
    stickyTable.classList.add('sticky-table');
    stickyTable.style.pointerEvents = 'none';
    // Set base styles for sticky table's head.
    clonedThead.style.display = 'block';
    clonedThead.style.transition = 'none';
    // Set base styles for sticky table head first row.
    clonedThead.childNodes[0].style.display = 'block';
    clonedThead.childNodes[0].style.marginBottom = -(widthModifier) + 'px';
    stickyTable.appendChild(clonedThead);
    table.parentNode.insertBefore(stickyTable, table);
    setWidth();
  }

  function eventListener (e) {
    const offsetTop = table.offsetTop;
    let topStickOffset = offsetTop;
    let bottomStickOffset = offsetTop + table.offsetHeight - thead.offsetHeight;
    if (offsetTop - scrollParent.scrollTop < 0 && bottomStickOffset > scrollParent.scrollTop) {
      sticked = true;
      stickyTable.style.display = null;
    }
    if (sticked === true && (topStickOffset - scrollParent.scrollTop > 0 || bottomStickOffset < scrollParent.scrollTop)) {
      sticked = false;
      stickyTable.style.display = 'none';
    }
  }

  // Prepare header with base styles and html.
  prepareHeader();

  // Start listen for parent scroll.
  scrollParent.addEventListener('scroll', eventListener);

  // Table scroll event, to have same scrollLeft position for sticky table based on parent one.
  table.addEventListener('scroll', (e) => {
    stickyTable.scrollLeft = table.scrollLeft
  });

  // Resize with debounce to update widths.
  function resizeDebounce() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setWidth();
    }, 500);
  }
  window.addEventListener('resize', resizeDebounce);
}

export default stickyTableHeader;
