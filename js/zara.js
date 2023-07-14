function toggleSearch() {
    document.querySelector('body').classList.toggle('search-in');
}

document.querySelector('.search-btn').addEventListener('click', function () {
    toggleSearch();

    document.querySelector('.search-input').focus();
});
