
import { obtenerUsuarios, obtenerPosts } from "./api.js";

export async function generarReporte() {
  const [usuarios, posts] = await Promise.all([obtenerUsuarios(), obtenerPosts()]);

  const reporte = usuarios.map((usuario) => {
    const postsDelUsuario = posts.filter((post) => post.userId === usuario.id);

    return {
      usuario: usuario.name,
      ciudad: usuario.address.city,
      cantidadPosts: postsDelUsuario.length,
    };
  });

  return reporte;
}