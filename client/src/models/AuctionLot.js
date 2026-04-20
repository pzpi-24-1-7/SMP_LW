// 1.1: Створити клас AuctionLot, що описує антикварний предмет
export class AuctionLot {
  
  // 3.1 У класі AuctionLot описати конструктор
  constructor({
    id,
    title = "Lot",
    category = "Category",
    startPrice = 100.00,
    imageUrl = "https://d2zp5xs5cp8zlg.cloudfront.net/image-87061-800.jpg" 
  }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.startPrice = Number(startPrice);
    this.imageUrl = imageUrl;
  }

  getCopy(newId) {
    return new AuctionLot({ ...this, id: newId })
  }
}