export const isLoggedIn = () => !!localStorage.getItem("admin_token");

export const logoutAdmin = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  window.location.href = "/login";
};
