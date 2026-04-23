export class AuctionLot {
  
  constructor({
    id,
    title = "Lot",
    category = "Category",
    startPrice = 100.00,
    imageUrl = "https://d2zp5xs5cp8zlg.cloudfront.net/image-87061-800.jpg",
    createdAt,
    total_hits,
  }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.startPrice = Number(startPrice);
    this.imageUrl = imageUrl;
    this.total_hits = total_hits;
    this.createdAt = createdAt;
  }

  getCopy(newId) {
    return new AuctionLot({ ...this, id: newId })
  }
}