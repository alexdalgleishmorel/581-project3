import { Injectable } from '@angular/core';

import { REGISTERED_USERS, User } from './data';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private registeredUsers: User[] = REGISTERED_USERS;
  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(this.registeredUsers[0]);
}
