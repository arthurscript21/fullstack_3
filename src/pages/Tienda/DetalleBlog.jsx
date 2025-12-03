import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostById } from '../../utils/localStorageHelper'; 

function DetalleBlog() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = getBlogPostById(id);
    setPost(foundPost);
  }, [id]);

  if (!post) {
    return (
      <div className="px-md-4 px-3 py-5 text-center">
        <h2>Artículo no encontrado</h2>
        <Link to="/blog" className="btn btn-primary mt-3">Volver al Blog</Link>
      </div>
    );
  }

  const createMarkup = (htmlString) => ({ __html: htmlString || '' });

  return (
    <div className="px-md-4 px-3 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <h1 className="mb-3 display-5">{post.titulo}</h1>
            <p className="text-muted small mb-3">
              Publicado el {new Date(post.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })} por {post.autor}
            </p>
            <img src={post.imagen} alt={post.titulo} className="img-fluid rounded mb-4 shadow-sm" style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
            
            <div className="blog-content" dangerouslySetInnerHTML={createMarkup(post.contenido)} />
            
            <hr className="my-4" />
            <div className="text-center">
                <Link to="/blog" className="btn btn-outline-secondary">← Volver al Blog</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DetalleBlog;