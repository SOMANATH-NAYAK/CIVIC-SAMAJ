// example: login
const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const data = await res.json();
localStorage.setItem('token', data.token);

// example: create complaint with image
const formData = new FormData();
formData.append('title', title);
formData.append('description', desc);
formData.append('category', category);
formData.append('image', file);

await fetch('http://localhost:5000/api/complaints', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: formData
});
