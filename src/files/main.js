var s4s = s4s || {};
s4s.apex = s4s.apex || {};

var s4s_apex_ir_pagination = {
    'buttonsBehavior': '',
    'firstPageTitle': '',
    'firstPageIcon': '',
    'lastPageTitle': '',
    'lastPageIcon': '',
    
    'createPaginationSelect': function (currentPageStart, rowsPerPage, totalRows, totalPages) {
        // Create the <select> element
        let paginationSelect = document.createElement('select');
        paginationSelect.className = 'a-IRR-pagination-select u-TF-item u-TF-item--select s4s-pagination-item';

        // Loop through pages and create <option> elements
        for (let i = 0; i < totalPages; i++) {
            let startRow = i * rowsPerPage + 1;
            let endRow = Math.min((i + 1) * rowsPerPage, totalRows);

            // Create <option> element
            let option = document.createElement('option');
            option.value = startRow;
            option.textContent = s4s_apex_ir_pagination.toSeparatedPageNumber(startRow) + ' - ' + s4s_apex_ir_pagination.toSeparatedPageNumber(endRow) + ' of ' + totalRows;

            // Set selected attribute for the current page
            if (startRow === currentPageStart) {
                option.textContent = 'row(s) ' + option.textContent;
                option.selected = true;
            }

            // Append the option to the select
            paginationSelect.appendChild(option);
        }

        return paginationSelect;
    },
    'createPaginationItem': function (regionId, startRow, rowsPerPage, pageTitle, pageIcon, pageDisabled) {
        // Create the <li> element
        let paginationItem = document.createElement('li');
        paginationItem.className = 'a-IRR-pagination-item s4s-pagination-item';
        
        // Hide button when configured
        if (s4s_apex_ir_pagination.buttonsBehavior === 'HIDE' && pageDisabled) {
            return paginationItem;
        }

        // Create the button inside the <li> element
        let paginationButton = s4s_apex_ir_pagination.createPaginationButton(regionId, startRow, rowsPerPage, pageTitle, pageIcon, pageDisabled);

        // Append the button to the <li>
        paginationItem.appendChild(paginationButton);

        return paginationItem;
    },
    'createPaginationButton': function (regionId, startRow, rowsPerPage, pageTitle, pageIcon, pageDisabled) {
        // Create the button element
        let button = document.createElement('button');
        button.className = 'a-Button a-IRR-button a-IRR-button--pagination';
        button.setAttribute('data-pagination', s4s_apex_ir_pagination.getPaginationData(startRow, rowsPerPage));
        button.setAttribute('aria-label', pageTitle);
        button.setAttribute('title', pageTitle);
        button.setAttribute('aria-controls', regionId);
        button.type = 'button';

        // Create the icon element inside the button
        let icon = document.createElement('span');
        icon.className = 'fa ' + pageIcon;
        icon.setAttribute('aria-hidden', 'true');
        button.appendChild(icon);

        // Disable the button if necessary
        if (s4s_apex_ir_pagination.buttonsBehavior === 'DISABLE' && pageDisabled) {
            button.disabled = true;
        }

        return button;
    },
    
    'addPaginationControls': function (regionId, rowsPerPage, currentPageStart, totalRows, totalPages) {
        let regionElement = document.getElementById(regionId);

        // Remove previous pagination items created by this script
        let paginationItems = regionElement.querySelectorAll('.s4s-pagination-item');
        paginationItems.forEach(item => item.remove());

        // Find the existing pagination container
        let pagination = regionElement.querySelector('.a-IRR-pagination');

        // Find the pagination label and hide it
        let paginationLabel = pagination.querySelector('.a-IRR-pagination-label');
        paginationLabel.style.display = 'none';

        // Create and insert the pagination select dropdown
        let paginationSelect = s4s_apex_ir_pagination.createPaginationSelect(currentPageStart, rowsPerPage, totalRows, totalPages);
        paginationLabel.after(paginationSelect);

        // Create the dropdown pagination button
        let paginationButton = s4s_apex_ir_pagination.createPaginationButton(regionId, currentPageStart, rowsPerPage, '@', null, false);
        paginationButton.style.display = 'none';
        paginationLabel.after(paginationButton);

        // Create the first and last pagination buttons
        let firstButton = s4s_apex_ir_pagination.createPaginationItem(regionId, 1, rowsPerPage, s4s_apex_ir_pagination.firstPageTitle, s4s_apex_ir_pagination.firstPageIcon, currentPageStart === 1);
        let lastButton = s4s_apex_ir_pagination.createPaginationItem(regionId, (totalPages - 1) * rowsPerPage + 1, rowsPerPage, s4s_apex_ir_pagination.lastPageTitle, s4s_apex_ir_pagination.lastPageIcon, (currentPageStart + rowsPerPage) > totalRows);

        // Insert first and last buttons
        pagination.insertBefore(firstButton, pagination.firstChild);
        pagination.appendChild(lastButton);
    },
    
    'initIRPagination': function () {
        // Set attribute values
        s4s_apex_ir_pagination.buttonsBehavior = this.action.attribute01;
        s4s_apex_ir_pagination.firstPageTitle = this.action.attribute02;
        s4s_apex_ir_pagination.firstPageIcon = this.action.attribute03;
        s4s_apex_ir_pagination.lastPageTitle = this.action.attribute04;
        s4s_apex_ir_pagination.lastPageIcon = this.action.attribute05;

        // Find pagination label X – Y of Z
        let regionId = this.triggeringElement.id;
        let label = document.getElementById(regionId).querySelector('.a-IRR-pagination-label');
        
        console.debug('initIRPagination: regionId', regionId);

        // Extract pagination details from the label (start row, total rows, etc.)
        let match = new RegExp(/(\d+)\s*-\s*(\d+)\s*[^\d]+\s*(\d+)/gi).exec(label.textContent.trim().replace(/,/g, ''));
        if (!match) return;

        let rowsPerPage = parseInt(document.getElementById(regionId).querySelector('input[id$="_row_select"]').value);
        let currentPageStart = parseInt(match[1]);
        let totalRows = parseInt(match[3]);

        console.debug('initIRPagination pagination', [rowsPerPage, currentPageStart, totalRows]);

        // Inject the enhanced pagination controls
        s4s_apex_ir_pagination.addPaginationControls(regionId, rowsPerPage, currentPageStart, totalRows, Math.ceil(totalRows / rowsPerPage));

        // Add event listeners to dropdown changes for pagination update
        document.getElementById(regionId).querySelectorAll('.a-IRR-pagination-select').forEach(function (select) {
            select.addEventListener('change', function () {
                let regionId = select.closest('.a-IRR-container').id.slice(0, -3);
                let rowsPerPage = parseInt(document.getElementById(regionId + '_row_select').value);
                select.previousElementSibling.setAttribute('data-pagination', s4s_apex_ir_pagination.getPaginationData(select.value, rowsPerPage));
                select.previousElementSibling.click();
            });
        });
    },
    
    'toSeparatedPageNumber': function (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    'getPaginationData': function (startRow, rowsPerPage) {
        return 'pgR_min_row=' + startRow + 'max_rows=' + rowsPerPage + 'rows_fetched=' + rowsPerPage;
    }
};

s4s.apex.ir_pagination = s4s_apex_ir_pagination;