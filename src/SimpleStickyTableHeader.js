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
  const parentBox = scrollParent.getBoundingClientRect();
  let resizeTimeout = null;
  let sticked = false;
  let stickyTable = null;

  function setWidth() {
    const headerCells = thead.getElementsByTagName('th');
    const stickyHeaderCells =  stickyTable.getElementsByTagName('th');

    [].forEach.call(headerCells, (cell, key) => {
      stickyHeaderCells[key].style.width = cell.offsetWidth + 'px';
      if (headerCells[key]) {
        headerCells[key].style.width = cell.offsetWidth + 'px';
      }
    });
    // Get border width as modifier to prevent misalignment with cells.
    const computedStyles = window.getComputedStyle(headerCells[0]);
    const widthModifier = parseInt(computedStyles.getPropertyValue('border-left-width'), 10);
    stickyTable.style.width = table.offsetWidth + 'px';
    stickyTable.getElementsByTagName('thead')[0].style.width = (thead.offsetWidth + widthModifier) + 'px';
  }

  function prepareHeader() {
    const offsetLeft = table.offsetLeft;
    const clonedThead = thead.cloneNode(true);
    stickyTable = document.createElement('table');
    stickyTable.style.left = (offsetLeft + parentBox.left) + 'px';
    stickyTable.style.top = parentBox.top + 'px';
    stickyTable.style.position = 'fixed';
    stickyTable.style.overflow = 'hidden';
    stickyTable.style.display = 'none';
    stickyTable.classList.add('sticky-table');
    clonedThead.style.display = 'block';
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
    }, 200);
  }
  window.addEventListener('resize', resizeDebounce);
}

export default stickyTableHeader;
