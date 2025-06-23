function fetchSearchResults(query) {
    fetch(`/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
            const searchResultsDiv = document.getElementById('searchResults');
            searchResultsDiv.innerHTML = '';
            data.forEach(product => {
                const productLink = document.createElement('a');
                productLink.textContent = product.product_title;
                productLink.href = `/product/${product.id}`; // Set href to product details page
                productLink.classList.add('search-result'); // Add a class for styling
                searchResultsDiv.appendChild(productLink);
            });
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', function() {
    const query = this.value.trim(); 
    if (query !== '') {
        fetchSearchResults(query);
    } else {
        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.innerHTML = '';
    }
});
