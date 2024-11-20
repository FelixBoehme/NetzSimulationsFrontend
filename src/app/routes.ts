import { DashboardComponent } from "./dashboard/dashboard.component";
import { GridComponent } from "./grid/grid.component";
import { AuthGuard } from "./guard/auth.guard";
import { StoreOverviewComponent } from "./store-overview/store-overview.component";

export const navRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
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
    component: StoreOverviewComponent,
    canActivate: [AuthGuard],
    title: "Speicher",
    icon: "bolt",
  },
];

export const appRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ...navRoutes
]
