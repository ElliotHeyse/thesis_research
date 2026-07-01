export interface Donor {
  DonorID: number;
  BusinessName: string | null;
  ContactName: string;
  ContactEmail: string;
  ContactTitle: string | null;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  TaxReceipt: number | boolean;
}

export interface DonorWithReceiptStats extends Donor {
  TotalItems: number;
  TotalValue: number;
}

export interface Bidder {
  BidderID: number;
  Name: string;
}

export interface Category {
  CategoryID: number;
  Description: string;
}

export interface Lot {
  LotID: number;
  Description: string;
  CategoryID: number | null;
  WinningBid: number | null;
  WinningBidder: number | null;
  Delivered: number | boolean;
  Image: string | null;
}

export interface LotListRow {
  LotID: number;
  Description: string;
  WinningBid: number | null;
  Winner: string | null;
  Delivered: number | boolean;
  Category: string | null;
}

export interface LotDetail extends Lot {
  Winner?: string | null;
  CategoryDescription?: string | null;
}

export interface Item {
  ItemID: number;
  Description: string;
  RetailValue: number;
  DonorID: number;
  LotID: number | null;
}

export interface ItemListRow extends Item {
  BusinessName?: string | null;
  LotDescription?: string | null;
}

export interface ItemDetail extends ItemListRow {
  ContactName?: string | null;
  ContactEmail?: string | null;
  ContactTitle?: string | null;
  CategoryID?: number | null;
}

export interface AuctionItem {
  ItemID: number;
  Description: string;
  RetailValue: number;
  CategoryID: number | null;
}

export interface DonorFormValues {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactTitle: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxReceipt?: boolean;
}

export interface ItemFormValues {
  description: string;
  retailValue: number;
  donorID: number;
  lotID: number | null;
}

export interface LotFormValues {
  description: string;
  categoryId: number | null;
  highestBid: number | null;
  bidderId: number | null;
  delivered: boolean;
  image: string | null;
}

export interface CategoryFormValues {
  description: string;
}

export interface LotAssignmentChange {
  itemID: number;
  newLotID: number;
}
