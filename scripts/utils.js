// Utility functions for formatting Excel sheets

/**
 * Creates a styled header for the Excel sheet.
 * @param {Worksheet} worksheet The worksheet object.
 * @param {string[]} headers The header titles.
 */
function createStyledHeader(worksheet, headers) {
    headers.forEach((header, index) => {
        worksheet.getCell(1, index + 1).value = header;
        worksheet.getCell(1, index + 1).font = { bold: true, size: 12 };
        worksheet.getCell(1, index + 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' }
        };
    });
}

/**
 * Applies filters to the given worksheet.
 * @param {Worksheet} worksheet The worksheet object.
 */
function applyFilters(worksheet) {
    worksheet.autoFilter = { from: 'A1', to: worksheet.lastColumn.number + '1' };
}

/**
 * Creates grouping for the specified columns in the worksheet.
 * @param {Worksheet} worksheet The worksheet object.
 * @param {number[]} columns Array of column indices to group.
 */
function createGrouping(worksheet, columns) {
    worksheet.getColumn(columns[0]).hidden = true;
    columns.forEach(columnIndex => {
        worksheet.getColumn(columnIndex).eachCell({ includeEmpty: true }, (cell) => {
            cell.value = `Grouped: ${cell.value}`;
        });
    });
}

/**
 * Formats a given cell value as currency.
 * @param {Cell} cell The cell to format.
 */
function formatCurrency(cell) {
    cell.numFmt = '$#,##0.00';
}

/**
 * Calculates the variation between two values.
 * @param {number} oldValue The old value.
 * @param {number} newValue The new value.
 * @returns {number} The variation percentage.
 */
function calculateVariation(oldValue, newValue) {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
}