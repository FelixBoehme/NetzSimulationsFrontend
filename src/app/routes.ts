import { AuthGuard } from "./guard/auth.guard";
import { OverviewComponent } from "./overview/overview.component";
import { StoreListComponent } from "./store-list/store-list.component";

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
    component: OverviewComponent,
    canActivate: [AuthGuard],
    title: "Grid",
    icon: "grid_on",
  },
  {
    path: 'stores',
    component: StoreListComponent,
    canActivate: [AuthGuard],
    title: "Stores",
    icon: "bolt",
  },
];

export const appRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ...navRoutes
]
