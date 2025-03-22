
export default async function  AsyncUser() {
    await delay(5000);
    return <div>
        <p>User name: John Doe</p>
    </div>;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
