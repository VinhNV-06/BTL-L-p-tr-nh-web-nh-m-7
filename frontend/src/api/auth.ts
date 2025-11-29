export const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Logout lỗi:", err);
  } finally {
    localStorage.removeItem("token"); 
  }
};
