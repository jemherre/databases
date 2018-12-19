DROP DATABASE IF EXISTS chat;

CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(240),
  id_users SMALLINT REFERENCES users(id),
  roomname VARCHAR(30)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30)
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

