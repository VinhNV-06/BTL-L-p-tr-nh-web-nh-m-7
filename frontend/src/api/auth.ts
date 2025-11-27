export const logout = async () => {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  localStorage.removeItem("token");
};
