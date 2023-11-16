import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StopWatchComponent } from './stop-watch/stop-watch.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stop-watch', component: StopWatchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
