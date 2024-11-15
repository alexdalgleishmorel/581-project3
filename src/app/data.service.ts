import { Injectable } from '@angular/core';

import { Accessory, CLOSE_ACCESSORIES, FAR_ACCESSORIES, PROXIMITY_THRESHOLD, REGISTERED_USERS, User } from './data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private closeAccessoryGenerator: Generator<Accessory, void, unknown> = circularAccessoryGenerator(CLOSE_ACCESSORIES);
  private farAccessoryGenerator: Generator<Accessory, void, unknown> = circularAccessoryGenerator(FAR_ACCESSORIES);
  private registeredUsers: User[] = REGISTERED_USERS;

  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(this.registeredUsers[0]);
  public displayedAccessory: Accessory = { id: '', name: '', imageUrl: '' };

  public getNextAccessory(proximity: number, expression: string | null): Accessory | void {
    if (expression && (expression === 'happy' || expression === 'sad')) {
      let updatedUser = this.currentUser.value;

      if (expression === 'happy') {
        addLikedAccessory(updatedUser, this.displayedAccessory);
        this.currentUser.next(updatedUser);
      }

      if (expression === 'sad') {
        removeLikedAccessory(updatedUser, this.displayedAccessory.id);
        this.currentUser.next(updatedUser);
      }
    }

    let nextAccessory: Accessory = { id: '', name: '', imageUrl: '' };
    if (proximity < PROXIMITY_THRESHOLD) {
      nextAccessory = this.closeAccessoryGenerator.next().value || nextAccessory;
    } else {
      nextAccessory = this.farAccessoryGenerator.next().value || nextAccessory;
    }

    this.displayedAccessory = nextAccessory;
    return nextAccessory;
  }
}

function* circularAccessoryGenerator(array: Accessory[]): Generator<Accessory, void, unknown> {
  let index = 0;
  while (true) {
    yield array[index];
    index = (index + 1) % array.length;
  }
}

function addLikedAccessory(user: User, accessory: Accessory): void {
  user.likedAccessories[accessory.id] = accessory; // Adds or updates the accessory by ID
}

function removeLikedAccessory(user: User, accessoryId: string): void {
  delete user.likedAccessories[accessoryId]; // Removes the accessory by ID
}
