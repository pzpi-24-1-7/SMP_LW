// 1.1: Створити клас AuctionLot, що описує антикварний предмет
class AuctionLot {
  
  // 3.1 У класі AuctionLot описати конструктор
  constructor({
    id,
    title = "Lot",
    category = "Category",
    startPrice = 100.00,
    imageUrl = "https://via.placeholder.com/150" }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.startPrice = startPrice;
    this.imageUrl = imageUrl;
  }

  // 4.1, 4.2 - Метод getCopy створює копію об’єкту, встановлюючи id копії на вказане значення
  getCopy(newId) {
    return new AuctionLot({ ...this, id: newId })
  }
}

// 1.2 Створити шість об’єктів-екземплярів класу AuctionLot
// 1.3 Задати довільні значення властивостям для кожного з об’єктів
export const lotsData = [
  new AuctionLot({ id: 1, title: "Старовинний годинник", category: "Антикваріат", startPrice: 500, imageUrl: "https://ireland.apollo.olxcdn.com/v1/files/5gn200ezsyq02-UA/image" }),
  new AuctionLot({ id: 2, title: "Олійний живопис", category: "Мистецтво", startPrice: 1200, imageUrl: "https://i.pinimg.com/736x/c5/77/6e/c5776ee0cdb51f697d81c9d6717333cd.jpg" }),
  new AuctionLot({ id: 3, title: "Бронзова статуетка", category: "Скульптура", startPrice: 300, imageUrl: "https://ireland.apollo.olxcdn.com/v1/files/b6nsea75u9ql1-UA/image;s=4272x2848" }),
  new AuctionLot({ id: 4, title: "Рідкісна монета", category: "Нумізматика", startPrice: 800, imageUrl: "https://ireland.apollo.olxcdn.com/v1/files/qd8ysvreymxn1-UA/image;s=576x1024" }),
  new AuctionLot({ id: 5, title: "Порцелянова ваза", category: "Кераміка", startPrice: 150, imageUrl: "https://image-thumbs.shafastatic.net/2184589706_310_430" }),
  new AuctionLot({ id: 6, title: "Лицарський меч", category: "Зброя", startPrice: 2000, imageUrl: "https://fama.ua/uploads/catalog/product/picture/80386/superbig_product.webp" })
];

// 4.3 Створити сьомий об’єкт, скопіювавши один з наявних об’єктів
lotsData.push(lotsData[0].getCopy(7));