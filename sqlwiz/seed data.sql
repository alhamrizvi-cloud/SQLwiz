INSERT INTO users (username, password, role) VALUES
('admin', ''' OR 1=1 --', 'admin'),
('user1', '" OR "1"="1', 'user'),
('user2', '-- OR #', 'user');

INSERT INTO products (name, category, price, description) VALUES
('Laptop', 'Electronics', 999.99, 'A powerful laptop'),
('Book', 'Books', 19.99, 'A great book'),
('Shoes', 'Clothing', 49.99, 'Comfortable shoes');

INSERT INTO orders (user_id, product_id) VALUES
(2, 1),
(3, 2);

INSERT INTO flags (flag_value) VALUES
('FLAG{SQLI_AUTH_BYPASS}'),
('FLAG{SQLI_BOOLEAN_BASED}'),
('FLAG{SQLI_WILDCARD_STRING}'),
('FLAG{SQLI_NUMERIC}'),
('FLAG{SQLI_COMMENT_BASED}'),
('FLAG{SQLI_ORDER_BY}'),
('FLAG{SQLI_GROUP_BY}'),
('FLAG{SQLI_UNION_SELECT}'),
('FLAG{SQLI_UNION_ENUM}'),
('FLAG{SQLI_FINGERPRINTING}');

