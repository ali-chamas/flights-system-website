const existingUser = window.localStorage.getItem("session") ?? null;
if (!existingUser) {
  window.location.assign("/client");
}
