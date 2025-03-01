export interface LoginRequest {
  identification: string;
  }
  // device_id: string;
  export interface VerifyRequest {
    identification: string;
    code: string;
    }

export interface verifyResponse {
    token: string;
  }
  