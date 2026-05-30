const API_URL = "https://69ed83d4af4ff533142bc4c6.mockapi.io/users";

export async function getAllUsers() {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("API not responding");
    return res.json()
}