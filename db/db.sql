drop table if exists roles cascade;
create table roles(
	id BIGSERIAL PRIMARY key,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255)  NULL ,
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
	
);
insert into roles(name,route,created_at,updated_at)values('Cliente','client/products/list','2022-01-24','2022-01-24');
insert into roles(name,route,created_at,updated_at)values('ECOMMERCE','ecommerce/orders/list','2022-01-24','2022-01-24');
insert into roles(name,route,created_at,updated_at)values('Repartidor','delivery/orders/list','2022-01-24','2022-01-24');

drop table if exists users cascade;
create table users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN  NULL,
	session_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);
drop table if exists user_has_roles cascade;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY key (id_user,id_rol)
);

drop table if exists categories cascade;
create table categories(
	id BIGSERIAL PRIMARY key,
	name VARCHAR(180) NOT null UNIQUE,
	description VARCHAR(255) not null,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

drop table if exists products cascade;
create table products(
	id BIGSERIAL PRIMARY key,
	name VARCHAR(180) NOT null UNIQUE,
	description VARCHAR(255) not null,
	price Decimal default 0,
	image1 VARCHAR(255) NOT NULL,
	image2 VARCHAR(255) NULL,
	image3 VARCHAR(255) NULL,
	id_category BIGINT not null,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY (id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);
drop table if exists address cascade;
create table address(
	id BIGSERIAL PRIMARY key,
	id_user BIGINT not null,
	address VARCHAR(255) not null,
	neightborhood VARCHAR(255) not null,
	lat Decimal default 0,
	lng Decimal default 0,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
    id BIGSERIAL PRIMARY KEY,
    id_client BIGINT NOT NULL,
    id_delivery BIGINT NULL,
    id_address BIGINT NOT NULL,
    lat DECIMAL DEFAULT 0,
    lng DECIMAL DEFAULT 0,
    status VARCHAR8(90) NOT NULL,
    timestamp  BIGINTNOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE,
);

DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products(
    id_order BIGINT NOT NULL,
    id_product BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    PRIMARY KEY(id_order, id_product),
    FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
);