import { environment } from './../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../members/interfaces/member';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  apiUrl: string;
  currentMember: Member = null;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}${environment.apiPath}/members`;
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(memberId: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${memberId}`)
      .pipe(
        tap(res => {
          this.loggedIn.next(res !== null);
          this.currentMember = res;
        })
      );
  }

  logout(): void {
    this.currentMember = null;
    this.loggedIn.next(false);
  }
}
