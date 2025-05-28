# Aqui se encuentra la base de datos utilizada en este proyecto:
CREATE TABLE roles (
	id SERIAL NOT NULL PRIMARY KEY, 
	descripcion TEXT NOT NULL
);
 
CREATE TABLE usuarios (
	id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	rol_id INT NOT NULL,
	CONSTRAINT fk_usu_rol FOREIGN KEY(rol_id) REFERENCES roles(id)
);
CREATE TABLE reportes (
	id SERIAL NOT NULL PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	descripcion TEXT,
	fecha DATE NOT NULL,
	urgencia BOOL DEFAULT false,
	vigencia INT DEFAULT 0,
	tipo_reporte INT DEFAULT 0,
	lugar INT DEFAULT 0,
	user_id INT NOT NULL,
	CONSTRAINT fk_rep_usu FOREIGN KEY(user_id) REFERENCES usuarios(id)
);
CREATE TABLE anuncios (
	id SERIAL NOT NULL PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	descripcion TEXT,
	fecha DATE NOT NULL,
	vigencia INT DEFAULT 0,
	lugar INT DEFAULT 0,
	user_id INT NOT NULL,
	CONSTRAINT fk_anu_usu FOREIGN KEY(user_id) REFERENCES usuarios(id)
);
