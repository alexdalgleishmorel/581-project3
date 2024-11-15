import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from 'src/app/data';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './app-simulation.component.html',
  styleUrls: ['./app-simulation.component.scss'],
})
export class AppSimulationComponent {
  public currentUser$: Observable<User>;
  public Object = Object;

  constructor(private dataService: DataService) {
    this.currentUser$ = this.dataService.currentUser.asObservable();
  }
}
