export interface LoginRequest {
  email:string,
  password:string,
  }
  // device_id: string;
  export interface VerifyRequest {
    identification: string;
    code: string;
    }

export interface verifyResponse {
    token: string;
  }
  