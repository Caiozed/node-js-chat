-- DROP TABLE users; 
-- DROP TABLE chats;
-- DROP TABLE members;
-- DROP TABLE messages;

-- CREATE TABLE users(
--                 id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--                 username VARCHAR(50) NOT NULL,
--                 password VARCHAR(50) NOT NULL,
--                 UNIQUE (username)
-- );

-- CREATE TABLE chats(
--                 id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--                 name VARCHAR(50) NOT NULL,
--                 description VARCHAR(500) NOT NULL,
--                 user_id INT NOT NULL,
--                 UNIQUE (name)
-- );

-- CREATE TABLE members(
--                 id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--                 user_id INT NOT NULL,
--                 chat_id INT NOT NULL,
--                 CONSTRAINT member UNIQUE (user_id, chat_id)
-- );

-- CREATE TABLE messages(
--                 id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--                 content VARCHAR(500) NOT NULL,
--                 sent_date DATETIME NOT NULL,
--                 user_id INT NOT NULL,
--                 chat_id INT NOT NULL
-- );

-- INSERT INTO chats(name, description) VALUES ("Teste", "Just a test");

-- delete from users where id > 0;
-- select * from users;
-- select * from chats;
-- select * from members;
-- select * from messages;
-- SELECT * FROM users INNER JOIN messages ON messages.user_id = users.id WHERE messages.chat_id = 1;
-- UPDATE chats SET name = "teste5", description = "normal description" WHERE id = "3";