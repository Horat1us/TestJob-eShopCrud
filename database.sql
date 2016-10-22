CREATE TABLE categories
(
  idcategory        INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idparent_category INT(11),
  category_name     VARCHAR(255)        NOT NULL
);
CREATE TABLE items
(
  iditem           INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idcategory       INT(11)             NOT NULL,
  item_name        VARCHAR(255)        NOT NULL,
  item_description LONGTEXT,
  price            DECIMAL(10, 2)      NOT NULL
);
CREATE TABLE users
(
  iduser INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  surname VARCHAR(64) NOT NULL,
  email VARCHAR(100) NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE orders
(
  idorder INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  iduser INT(11),
  date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  status ENUM('created', 'processing', 'finished') DEFAULT 'created' NOT NULL
);
CREATE TABLE order_items
(
  idorder_item INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idorder INT(11) NOT NULL,
  iditem INT(11)
);
ALTER TABLE categories ADD FOREIGN KEY (idparent_category) REFERENCES categories (idcategory) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX categories_categories_idcategory_fk ON categories (idparent_category);
CREATE UNIQUE INDEX categories_idcategory_uindex ON categories (idcategory);
ALTER TABLE items ADD FOREIGN KEY (idcategory) REFERENCES categories (idcategory) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX items_categories_idcategory_fk ON items (idcategory);
CREATE UNIQUE INDEX items_iditem_uindex ON items (iditem);
CREATE UNIQUE INDEX items_item_name_uindex ON items (item_name);
CREATE UNIQUE INDEX users_iduser_uindex ON users (iduser);
ALTER TABLE orders ADD FOREIGN KEY (iduser) REFERENCES users (iduser) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX orders_idorder_uindex ON orders (idorder);
CREATE INDEX orders_status_index ON orders (status);
CREATE INDEX orders_users_iduser_fk ON orders (iduser);
ALTER TABLE order_items ADD FOREIGN KEY (idorder) REFERENCES orders (idorder) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE order_items ADD FOREIGN KEY (iditem) REFERENCES items (iditem) ON DELETE SET NULL ON UPDATE SET NULL;
CREATE UNIQUE INDEX order_items_idorder_item_uindex ON order_items (idorder_item);
CREATE INDEX order_items_items_iditem_fk ON order_items (iditem);
CREATE INDEX order_items_orders_idorder_fk ON order_items (idorder);