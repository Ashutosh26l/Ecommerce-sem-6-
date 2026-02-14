function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

if (searchInput && searchForm) {
  searchInput.addEventListener(
    "input",
    debounce((event) => {
      const query = event.target.value.trim();
      const url = new URL(searchForm.action, window.location.origin);

      if (query) {
        url.searchParams.set("q", query);
      }

      window.location.href = url.toString();
    }, 300)
  );
}
