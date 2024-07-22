import { GridComponent } from "./grid/grid.component";
import { AuthGuard } from "./guard/auth.guard";
import { OverviewComponent } from "./overview/overview.component";
import { StoreTableComponent } from "./store-table/store-table.component";

export const navRoutes = [
  {
    path: 'dashboard',
    component: OverviewComponent,
    canActivate: [AuthGuard],
    title: "Dashboard",
    icon: "dashboard",
  },
  {
    path: 'grid',
    component: GridComponent,
    canActivate: [AuthGuard],
    title: "Grid",
    icon: "grid_on",
  },
  {
    path: 'stores',
    component: StoreTableComponent,
    canActivate: [AuthGuard],
    title: "Stores",
    icon: "bolt",
  },
];

export const appRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ...navRoutes
]
