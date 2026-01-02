export interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  dateIssued: string; // ISO date string (YYYY-MM-DD)
  description: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
}
