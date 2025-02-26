import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/apiResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL: string;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.baseURL = environment.baseURL;
  }

  private getHeaders(
    withAuth: boolean = true,
    isFormData: boolean = false
  ): HttpHeaders {
    let headers = new HttpHeaders();

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (withAuth) {
      const token = this.tokenService.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
      }
    }

    return headers;
  }

  get<T>(
    route: string,
    page: number = 5,
    requiresAuth: boolean = false,
    query?: string
  ): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(requiresAuth);
    const queryParams = [];

    if (page) queryParams.push(`page=${page}`);
    if (query) queryParams.push(query);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const url = `${this.baseURL}${route}${queryString}`;

    return this.http.get<ApiResponse<T>>(url, {
      headers,
      withCredentials: true,
    });
  }

  post<T>(
    route: string,
    data: any,
    requiresAuth: boolean = true
  ): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(requiresAuth);
    const url = `${this.baseURL}${route}`;

    return this.http.post<ApiResponse<T>>(url, data, {
      headers,
      withCredentials: true,
    });
  }

  put<T>(
    route: string,
    data: any,
    requiresAuth: boolean = true,
    isFormData: boolean = false
  ): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(requiresAuth, isFormData);
    const url = `${this.baseURL}${route}`;

    const options = {
      headers,
      withCredentials: true,
    };

    return this.http.put<ApiResponse<T>>(url, data, options);
  }

  delete<T>(
    route: string,
    requiresAuth: boolean = true
  ): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(requiresAuth);
    const url = `${this.baseURL}${route}`;

    return this.http.delete<ApiResponse<T>>(url, {
      headers,
      withCredentials: true,
    });
  }

  fetch<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
