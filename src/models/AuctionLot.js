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
  createAuctionLot({ id: 1, title: "Старинные часы", category: "Антиквариат", startPrice: 500 }),
  createAuctionLot({ id: 2, title: "Картина маслом", category: "Искусство", startPrice: 1200 }),
  createAuctionLot({ id: 3, title: "Бронзовая статуэтка", category: "Скульптура", startPrice: 300 }),
  createAuctionLot({ id: 4, title: "Редкая монета", category: "Нумизматика", startPrice: 800 }),
  createAuctionLot({ id: 5, title: "Фарфоровая ваза", category: "Керамика", startPrice: 150 }),
  createAuctionLot({ id: 6, title: "Рыцарский меч", category: "Оружие", startPrice: 2000 })
];

// Задание 4: Створюємо сьомий об’єкт, скопіювавши перший
lotsData.push(copyLot(lotsData[0], 7));