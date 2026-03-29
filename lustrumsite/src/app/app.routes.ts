import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home-page/home-page').then((module) => module.HomePage),
		title: 'Delerium | Home',
	},
	{
		path: 'activiteiten',
		loadComponent: () =>
			import('./pages/activities-page/activities-page').then((module) => module.ActivitiesPage),
		title: 'Delerium | Activiteiten',
	},
	{
		path: '**',
		redirectTo: '',
	},
];
