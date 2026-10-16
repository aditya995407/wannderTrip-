export interface AuthUser {
  id: string;
  google_id: string;
  name: string;
  email: string;
  picture: string;
}

export interface BackendAuthResponse {
  success: boolean;
  token: string;
  user: {
    command?: string;
    rowCount?: number;
    oid?: number;
    rows?: Array<{
      id?: string;
      google_id?: string;
      name?: string;
      email?: string;
      picture?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  } | AuthUser;
  message?: string;
}
