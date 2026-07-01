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
  TaxReceipt: number;
}

export interface DonorWithReceiptStats extends Donor {
  TotalItems: number;
  TotalValue: number;
}

export interface Category {
  CategoryID: number;
  Description: string;
}

export interface Bidder {
  BidderID: number;
  Name: string;
}

export interface Lot {
  LotID: number;
  Description: string;
  CategoryID: number | null;
  WinningBid: number | null;
  WinningBidder: number | null;
  Delivered: number;
  Image: string | null;
}

export interface LotListRow {
  LotID: number;
  Description: string;
  WinningBid: number | null;
  Winner: string | null;
  Delivered: number;
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
  BusinessName?: string | null;
  ContactName?: string | null;
  ContactEmail?: string | null;
  ContactTitle?: string | null;
  LotDescription?: string | null;
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
  taxReceipt: boolean;
}

export interface ItemFormValues {
  description: string;
  retailValue: string;
  donorID: string;
  lotID: string;
}

export interface LotFormValues {
  description: string;
  categoryId: string;
  highestBid: string;
  bidderId: string;
  delivered: boolean;
  image: string;
}

export interface CategoryFormValues {
  description: string;
}
