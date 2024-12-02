export interface BookType {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Name: string;
  NamePortugues: string;
  Descripition: string;
  DescripitionPortugues: string;
  Author: string[];
  Tags: string[];
  Publisher: string;
  Year: string;
  LinkAmazon: string;
  Link: string;
  Cover: string;
}
