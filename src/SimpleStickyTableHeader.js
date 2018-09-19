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
  let sticked = false;
  let stickyHeader = null;
  let bodyFirstRowCells = [];
  const parentBox = scrollParent.getBoundingClientRect();
  function setWidth() {
    const headerCells = thead.getElementsByTagName('th');
    const stickyHeaderCells =  stickyHeader.getElementsByTagName('th');
    const tbody = table.getElementsByTagName('tbody')[0];
    if (tbody) {
      const firstRow = tbody.getElementsByTagName('tr')[0];
      if (firstRow) {
        bodyFirstRowCells = firstRow.getElementsByTagName('td');
      }
    }
    [].forEach.call(headerCells, (cell, key) => {
      stickyHeaderCells[key].style.width = cell.offsetWidth + 'px';
      if (bodyFirstRowCells[key]) {
        bodyFirstRowCells[key].style.width = cell.offsetWidth + 'px';
      }
    });
  }
  function prepareHeader() {
    const offsetLeft = table.offsetLeft;
    const clonedThead = thead.cloneNode(true);
    clonedThead.classList.add('sticky-header');
    clonedThead.style.left = (offsetLeft + parentBox.left) + 'px';
    clonedThead.style.top = parentBox.top + 'px';
    clonedThead.style.position = 'fixed';
    clonedThead.style.display = 'none';
    table.insertBefore(clonedThead, table.childNodes[0]);
    stickyHeader = clonedThead;
    setWidth();
  }
  function eventListener (e) {
    const offsetTop = table.offsetTop;
    let topStickOffset = offsetTop;
    let bottomStickOffset = offsetTop + table.offsetHeight - thead.offsetHeight;
    if (sticked !== true && (offsetTop - scrollParent.scrollTop < 0)) {
      sticked = true;
      stickyHeader.style.display = null;
    }
    if (sticked === true && (topStickOffset - scrollParent.scrollTop > 0 || bottomStickOffset < scrollParent.scrollTop)) {
      sticked = false;
      stickyHeader.style.display = 'none';
    }
  }

  prepareHeader();
  scrollParent.addEventListener('scroll', eventListener);
}

export default stickyTableHeader;
