// Only if table-style varint then below structure is expected, otherwise the block is left as is

export default function decorate(block) {
  if (!block.classList.contains('table-style')) return;

  const rows = [...block.children];
  if (!rows.length) return;

  const table = document.createElement('table');
  table.className = 'seo-content__table';

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const cols = [...row.children];

    cols.forEach((col) => {
      const cell = document.createElement(rowIndex === 0 ? 'th' : 'td');
      cell.innerHTML = col.innerHTML;
      tr.appendChild(cell);
    });

    table.appendChild(tr);
  });

  block.innerHTML = '';
  block.appendChild(table);
}