CREATE DATABASE auction_db;
USE auction_db;

CREATE TABLE lots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'Lot',
    category VARCHAR(255) NOT NULL DEFAULT 'Category',
    startPrice DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
    imageUrl VARCHAR(1000) DEFAULT 'https://placehold.net/main.svg',
    -- remove views !delete column
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lot_ip (
    ip VARCHAR(64),
    lot_id INT,
    hits INT DEFAULT 1,
    last_hit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ip, lot_id) ,
    FOREIGN KEY (lot_id) REFERENCES lots(id) ON DELETE CASCADE 
);

INSERT INTO lots (title, category, startPrice, imageUrl) VALUES 
('Старовинний годинник', 'Антикваріат', 500.00, 'https://ireland.apollo.olxcdn.com/v1/files/5gn200ezsyq02-UA/image'),
('Олійний живопис', 'Мистецтво', 1200.00, 'https://i.pinimg.com/736x/c5/77/6e/c5776ee0cdb51f697d81c9d6717333cd.jpg'),
('Бронзова статуетка', 'Скульптура', 300.00, 'https://ireland.apollo.olxcdn.com/v1/files/b6nsea75u9ql1-UA/image;s=4272x2848'),
('Рідкісна монета', 'Нумізматика', 800.00, 'https://ireland.apollo.olxcdn.com/v1/files/qd8ysvreymxn1-UA/image;s=576x1024'),
('Порцелянова ваза', 'Кераміка', 150.00, 'https://image-thumbs.shafastatic.net/2184589706_310_430'),
('Лицарський меч', 'Зброя', 2000.00, 'https://fama.ua/uploads/catalog/product/picture/80386/superbig_product.webp'),
('Старовинний годинник (Копія)', 'Антикваріат', 500.00, 'https://ireland.apollo.olxcdn.com/v1/files/5gn200ezsyq02-UA/image');