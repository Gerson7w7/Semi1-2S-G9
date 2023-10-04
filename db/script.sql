USE Proyecto2;

CREATE TABLE Usuarios (
    id_usuario      INT PRIMARY KEY AUTO_INCREMENT,
    nombre          VARCHAR(35) NOT NULL,
    correo          VARCHAR(50) NOT NULL,
    dpi             BIGINT NOT NULL,
    password        VARCHAR(255) NOT NULL
);

CREATE TABLE Publicaciones (
    id_publicacion  INT PRIMARY KEY AUTO_INCREMENT,
    descripcion     TEXT NOT NULL,
    id_usuario      INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);