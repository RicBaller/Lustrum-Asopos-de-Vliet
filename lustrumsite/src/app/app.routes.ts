import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home-page/home-page').then((module) => module.HomePage),
		title: 'Delirium | Home',
	},
	{
		path: 'activiteiten',
		loadComponent: () =>
			import('./pages/activities-page/activities-page').then((module) => module.ActivitiesPage),
		title: 'Delirium | Activiteiten',
	},
	{
		path: 'albums',
		loadComponent: () =>
			import('./pages/albums-page/albums-page').then((module) => module.AlbumsPage),
		title: 'Delirium | Fotoarchief',
	},
	{
		path: 'albums/:id',
		loadComponent: () =>
			import('./pages/album-detail-page/album-detail-page').then((module) => module.AlbumDetailPage),
		title: 'Delirium | Album',
	},
	{
		path: 'videos',
		loadComponent: () =>
			import('./pages/videos-page/videos-page').then((module) => module.VideosPage),
		title: "Delirium | Video's",
	},
	{
		path: 'shop',
		loadComponent: () =>
			import('./pages/shop-page/shop-page').then((module) => module.ShopPage),
		title: 'Delirium | Shop',
	},
	{
		path: '**',
		redirectTo: '',
	},
];
