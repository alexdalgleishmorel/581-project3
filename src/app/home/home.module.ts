import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AppSimulationComponent } from '../components/app-simulation/app-simulation.component';
import { MirrorComponent } from '../components/mirror/mirror.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, AppSimulationComponent, MirrorComponent]
})
export class HomePageModule {}
