import { GridComponent } from "./grid/grid.component";
import { AuthGuard } from "./guard/auth.guard";
import { StoreTableComponent } from "./store-table/store-table.component";

export const navRoutes = [
  {
    path: 'dashboard',
    component: GridComponent,
    canActivate: [AuthGuard],
    title: "Dashboard",
    icon: "dashboard",
  },
  {
    path: 'grid',
    component: GridComponent,
    canActivate: [AuthGuard],
    title: "Netz",
    icon: "grid_on",
  },
  {
    path: 'stores',
    component: StoreTableComponent,
    canActivate: [AuthGuard],
    title: "Speicher",
    icon: "bolt",
  },
];

export const appRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ...navRoutes
]
