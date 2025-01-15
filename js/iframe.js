function toggleIframe() {
    const iframeContainer = document.getElementById('iframe-container');
    const tab = document.getElementById('tab-text');
    const arrow = document.getElementById('arrow');

    // tab.textContent = (tab.innerHTML === 'Show Registry') ? 'Hide Registry' : 'Show Registry';

            if (iframeContainer.style.display === 'block') {
                iframeContainer.style.display = 'none';
                arrow.innerHTML = '&#9660;'; // Down arrow
                tab.innerText = 'Show Registry';
            } else {
                iframeContainer.style.display = 'block';
                arrow.innerHTML = '&#9650;'; // Up arrow
                tab.innerText = 'Hide Registry';
            }
}