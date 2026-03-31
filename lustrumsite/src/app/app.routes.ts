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
		path: 'albums',
		loadComponent: () =>
			import('./pages/albums-page/albums-page').then((module) => module.AlbumsPage),
		title: 'Delerium | Fotoarchief',
	},
	{
		path: 'albums/:id',
		loadComponent: () =>
			import('./pages/album-detail-page/album-detail-page').then((module) => module.AlbumDetailPage),
		title: 'Delerium | Album',
	},
	{
		path: '**',
		redirectTo: '',
	},
];
