import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { appRoutes } from './routes';

@NgModule({
  imports: [RouterModule.forRoot(appRoutes as Routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
