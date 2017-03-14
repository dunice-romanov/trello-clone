import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { LoginGuard } from '../guards/login.guard';
import { LoginComponent } from '../login/login.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { RegisterComponent } from '../register/register.component'
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [LoginGuard]
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [LoginGuard]
	}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard, LoginGuard ]
})
export class AppRoutingModule { }
