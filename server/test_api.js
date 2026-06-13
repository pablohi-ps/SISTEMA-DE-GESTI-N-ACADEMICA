async function test() {
  const resLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'estudiante', password: 'estudiante' })
  });
  const dataLogin = await resLogin.json();
  console.log("Login:", dataLogin);
  
  if (dataLogin.token) {
    const resMod = await fetch('http://localhost:3000/api/modules', {
      headers: { 'Authorization': 'Bearer ' + dataLogin.token }
    });
    const dataMod = await resMod.json();
    console.log("Modules:", dataMod);
  }
}
test();
