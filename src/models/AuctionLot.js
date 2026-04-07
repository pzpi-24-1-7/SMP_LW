// Задание 3: Функция-конструктор с дефолтными значениями
export const createAuctionLot = ({
  id,
  title = "Lot",
  category = "Category",
  startPrice = 100.00,
  isActive = true,
  imageUrl = "https://via.placeholder.com/150"
}) => {
  return { id, title, category, startPrice, isActive, imageUrl };
};

// Задание 4: Метод копирования (создает новый объект с новым id)
export const copyLot = (lot, newId) => {
  return { ...lot, id: newId };
};

// Задание 1 и 3: Создаем 6 объектов
export const lotsData = [
  createAuctionLot({ id: 1, title: "Старовинний годинник", category: "Антикваріат", startPrice: 500, imageUrl: "https://ireland.apollo.olxcdn.com/v1/files/5gn200ezsyq02-UA/image"}),
  createAuctionLot({ id: 2, title: "Олійний живопис", category: "Мистецтво", startPrice: 1200, imageUrl: "https://i.pinimg.com/736x/c5/77/6e/c5776ee0cdb51f697d81c9d6717333cd.jpg" }),
  createAuctionLot({ id: 3, title: "Бронзова статуетка", category: "Скульптура", startPrice: 300, imageUrl: "https://ireland.apollo.olxcdn.com/v1/files/b6nsea75u9ql1-UA/image;s=4272x2848" }),
  createAuctionLot({ id: 4, title: "Рідкісна монета", category: "Нумізматика", startPrice: 800, imageUrl: "https://ireland.apollo.olxcdn.com/v1/files/qd8ysvreymxn1-UA/image;s=576x1024" }),
  createAuctionLot({ id: 5, title: "Порцелянова ваза", category: "Кераміка", startPrice: 150, imageUrl: "https://image-thumbs.shafastatic.net/2184589706_310_430" }),
  createAuctionLot({ id: 6, title: "Лицарський меч", category: "Зброя", startPrice: 2000, imageUrl: "https://fama.ua/uploads/catalog/product/picture/80386/superbig_product.webp" })
];

// Задание 4: Створюємо сьомий об’єкт, скопіювавши перший
lotsData.push(copyLot(lotsData[0], 7));