import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { OverviewComponent } from './overview/overview.component';
import { StoreListComponent } from './store-list/store-list.component';

const routes: Routes = [
  { path: '', component: OverviewComponent, canActivate: [AuthGuard] },
  {
    path: 'stores',
    component: StoreListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
