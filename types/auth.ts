export interface EmailConfirm {
  token: string;
  tokenId: string;
  email: string;
}
export interface ResetPassword {
  token: string;
  password: string;
  email?: string;
}

export interface UpdateResponse {
  matchedCount: number;
  modifiedCount: number;
}
