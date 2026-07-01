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
  TaxReceipt: boolean | number;
}

export interface DonorSelect {
  DonorID: number;
  BusinessName: string | null;
  ContactName: string;
}

export interface DonorPendingReceipt extends Donor {
  TotalItems: number;
  TotalValue: number;
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

export interface LotDescription {
  LotID: number;
  Description: string;
}

export interface Lot {
  LotID: number;
  Description: string;
  CategoryID: number | null;
  WinningBid: number | null;
  WinningBidder: number | null;
  Delivered: boolean | number;
  Image: string | null;
  Winner?: string | null;
  Category?: string | null;
}

export interface Category {
  CategoryID: number;
  Description: string;
}

export interface Bidder {
  BidderID: number;
  Name: string;
}

export interface AuctionItem {
  ItemID: number;
  Description: string;
  RetailValue: number;
  CategoryID: number | null;
}

export interface CategoryDescription {
  CategoryID: number;
  Description: string;
}

export interface LotAssignment {
  itemID: number;
  newLotID: number;
}

export interface DonorInput {
  businessName?: string;
  contactName: string;
  contactEmail?: string;
  contactTitle?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  taxReceipt?: boolean | number;
}

export interface ItemInput {
  description: string;
  retailValue: number;
  donorID: number;
  lotID?: number | null;
}

export interface LotInput {
  description: string;
  categoryID?: number | null;
  winningBid?: number | null;
  winningBidder?: number | null;
  delivered?: boolean;
  image?: string | null;
}

export interface CategoryInput {
  description: string;
}

export interface BiddingSheetOptions {
  startingBid?: number;
  bidIncrement?: number;
  rows?: number;
}
