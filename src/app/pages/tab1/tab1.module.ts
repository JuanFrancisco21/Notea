import { IonicModule, NavController, NavParams } from '@ionic/angular';
import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { PipesModule } from '../../services/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
