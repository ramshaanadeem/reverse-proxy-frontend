export interface UserType {
  id: string
  username: string
  email: string
  createdAt: string
  recentActivity?: {
    action: string
    timestamp: string
  }[]
}

export interface LogEntry {
  id: string
  method: string
  url: string
  responseTime: number
  timestamp: string
  targetUrl: string
  statusCode: number
}

export interface Logs {
  logs: LogEntry[]
  pagination: {
    totalCount: number
    page: number
    pageSize: number
  }
}


export interface ConfigType {
    loggingEnabled: boolean;
    whitelistedEndpoints: string[];
    blacklistedEndpoints: string[];
    rateLimitEnabled: boolean;
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;
    cacheEnabled: boolean;
    cacheTTL: number;
    targetUrl: string;
    timeout: number;
    retryAttempts: number;
    logRequestBody: boolean;
    logResponseBody: boolean;
    maxLogSize: number;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
    __v?: number;
}

export interface ExtendedUserType {
  id: number
  name: string
  username: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    zipcode: string
    suite: string
  }
  website?: string
  company?: {
    name: string
    catchPhrase: string,
    bs: string
  }
  // lastLogin?: string
  // status?: "active" | "inactive" | "suspended"
}