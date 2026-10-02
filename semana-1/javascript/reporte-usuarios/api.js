
export async function obtenerUsuarios() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.log("No se pudieron obtener los usuarios:", error.message);
    throw error;
  }
}

export async function obtenerPosts() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.log("No se pudieron obtener los posts:", error.message);
    throw error;
  }
}