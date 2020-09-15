import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: string;
  name: string;
  email: string;
  website: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  api: string = "https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api)
  }
  public getJSON(): Observable<any> {
    return this.http.get("./assets/data.json");
  }
  loadJSON(): Observable<any> {
    return this.http.get("./assets/data_copy.json");
  }
  takeJSON(): any{
    return this.http.get("./assets/data_copy.json");
  }
}
