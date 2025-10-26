export function saveAuth(token: string, user: any) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
export function getUser() {
  const s = localStorage.getItem('user');
  return s ? JSON.parse(s) : null;
}
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
