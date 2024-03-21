if (JSON.parse(window.localStorage.getItem("session")).isAdmin == 0) {
  window.location.assign("/client");
}
