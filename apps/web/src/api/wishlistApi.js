export async function fetchWishlist() {
  const res = await fetch(process.env.REACT_APP_API_URL + '/api/wishlist/items', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  return res.json();
}

export async function exportWishlist() {
  const res = await fetch(process.env.REACT_APP_API_URL + '/api/wishlist/export', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wishlist_export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}