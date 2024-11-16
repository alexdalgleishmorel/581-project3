import { Injectable } from '@angular/core';

import { Accessory, CLOSE_ACCESSORIES, FAR_ACCESSORIES, PROXIMITY_THRESHOLD, User } from './data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private closeAccessoryGenerator: Generator<Accessory, void, unknown> = circularAccessoryGenerator(CLOSE_ACCESSORIES);
  private farAccessoryGenerator: Generator<Accessory, void, unknown> = circularAccessoryGenerator(FAR_ACCESSORIES);
  private nextPersionId = 1;

  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>({ id: '', name: '', likedAccessories: {} });
  public displayedAccessory: Accessory = { id: '', name: '', imageUrl: '', productUrl: '' };
  public storedUsers = new Map<string, User>();
  public storedFaces = new Map<string, FaceDescriptor>();

  public getNextAccessory(proximity: number, expression: string | null): Accessory | void {
    if (expression && (expression === 'happy' || expression === 'surprised')) {
      let updatedUser = this.currentUser.value;

      if (expression === 'happy') {
        addLikedAccessory(updatedUser, this.displayedAccessory);
        this.currentUser.next(updatedUser);
        this.storedUsers.set(updatedUser.id, updatedUser);
      }

      if (expression === 'surprised') {
        removeLikedAccessory(updatedUser, this.displayedAccessory.id);
        this.currentUser.next(updatedUser);
        this.storedUsers.set(updatedUser.id, updatedUser);
      }
    }

    let nextAccessory: Accessory = { id: '', name: '', imageUrl: '', productUrl: '' };
    if (proximity < PROXIMITY_THRESHOLD) {
      nextAccessory = this.closeAccessoryGenerator.next().value || nextAccessory;
    } else {
      nextAccessory = this.farAccessoryGenerator.next().value || nextAccessory;
    }

    this.displayedAccessory = nextAccessory;
    return nextAccessory;
  }

  public getOrAssignId(newDescriptor: Float32Array): string {
    const threshold = 0.6;
  
    for (const [id, storedDescriptor] of this.storedFaces.entries()) {
      const distance = this.euclideanDistance(newDescriptor, storedDescriptor);
      if (distance < threshold) {
        const user = this.storedUsers.get(id);
        if (user) {
          this.currentUser.next(user);
        }
        return id;
      }
    }

    const newId = `user-${this.nextPersionId++}`;
    this.storedFaces.set(newId, newDescriptor);
    this.storedUsers.set(newId, { id: newId, name: newId, likedAccessories: {} });
    return newId;
  }

  private euclideanDistance(a: Float32Array, b: Float32Array): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
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

type FaceDescriptor = Float32Array;
