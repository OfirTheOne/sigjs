import { getRouter } from "sig/router";



export function LoginPage() {
    const router = getRouter();

    function handleLogin(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const password = form.password.value;

        fetch('http://localhost:3030/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    localStorage.setItem('token', res.token);
                    console.log('Login successful');
                    router.push('/app/recipes');
                } else {
                    console.log('Login failed');
                }
            });
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit" >Login</button>
            </form>
        </div>
    );
}