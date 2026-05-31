import { Routes } from '@angular/router';
import { SeoRouteData } from './seo/seo.types';
import { HomePage } from './pages/home-page/home-page';

const homeSchema: SeoRouteData['schema'] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lustrum Asopos de Vliet',
    url: 'https://asoposlustrum.nl/',
    logo: 'https://asoposlustrum.nl/favicon.ico',
  },
  {
    '@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Delirium XIII',
		url: 'https://asoposlustrum.nl/',
  },
];

export const routes: Routes = [
	{
		path: '',
		component: HomePage,
		title: 'Delirium | Home',
		data: {
			seo: {
				description: 'Delirium XIII is het lustrum van Asopos de Vliet met activiteiten, media en merchandise.',
				schema: homeSchema,
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'activiteiten',
		loadComponent: () =>
			import('./pages/activities-page/activities-page').then((module) => module.ActivitiesPage),
		title: 'Delirium | Activiteiten',
		data: {
			seo: {
				description: 'Bekijk het volledige activiteitenprogramma van Delirium XIII, inclusief data en ticketlinks.',
				schema: [
					{
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Activiteiten Delirium XIII',
						url: 'https://asoposlustrum.nl/activiteiten',
					},
					{
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: [
							{
								'@type': 'Question',
								name: 'Waar vind ik het actuele programma van Delirium XIII?',
								acceptedAnswer: {
									'@type': 'Answer',
									text: 'Op deze activiteitenpagina vind je het volledige programma in chronologische volgorde.',
								},
							},
							{
								'@type': 'Question',
								name: 'Kan ik direct tickets kopen voor activiteiten?',
								acceptedAnswer: {
									'@type': 'Answer',
									text: 'Ja, als een evenement een ticketlink heeft, kun je direct doorklikken vanaf de activiteitenkaart.',
								},
							},
						],
					},
				],
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'albums',
		loadComponent: () =>
			import('./pages/albums-page/albums-page').then((module) => module.AlbumsPage),
		title: 'Delirium | Fotoarchief',
		data: {
			seo: {
				description: 'Bekijk het fotoarchief van Delirium XIII en herbeleef alle momenten.',
				type: 'article',
				schema: {
					'@context': 'https://schema.org',
					'@type': 'ImageGallery',
					name: 'Delirium XIII Fotoarchief',
					url: 'https://asoposlustrum.nl/albums',
				},
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'albums/:id',
		loadComponent: () =>
			import('./pages/album-detail-page/album-detail-page').then((module) => module.AlbumDetailPage),
		title: 'Delirium | Album',
		data: {
			seo: {
				description: 'Bekijk een specifiek Delirium XIII album met alle foto\'s van dit moment.',
				type: 'article',
				noindex: true,
				canonicalPath: '/albums',
				schema: {
					'@context': 'https://schema.org',
					'@type': 'WebPage',
					name: 'Delirium XIII Album',
				},
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'videos',
		loadComponent: () =>
			import('./pages/videos-page/videos-page').then((module) => module.VideosPage),
		title: "Delirium | Video's",
		data: {
			seo: {
				description: 'Bekijk de videobekendmakingen en aftermovies van Delirium XIII.',
				type: 'article',
				schema: {
					'@context': 'https://schema.org',
					'@type': 'VideoGallery',
					name: 'Delirium XIII Video\'s',
					url: 'https://asoposlustrum.nl/videos',
				},
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'shop',
		loadComponent: () =>
			import('./pages/shop-page/shop-page').then((module) => module.ShopPage),
		title: 'Delirium | Shop',
		data: {
			seo: {
				description: 'Shop exclusieve Delirium XIII merchandise van Asopos de Vliet.',
				schema: [
					{
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Delirium XIII Shop',
						url: 'https://asoposlustrum.nl/shop',
					},
					{
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: [
							{
								'@type': 'Question',
								name: 'Welke Delirium merchandise is beschikbaar?',
								acceptedAnswer: {
									'@type': 'Answer',
									text: 'In de shop vind je uitgelichte items en de volledige collectie, gegroepeerd per categorie.',
								},
							},
							{
								'@type': 'Question',
								name: 'Kan ik producten direct bestellen?',
								acceptedAnswer: {
									'@type': 'Answer',
									text: 'Ja, bij producten met een actieve link kun je direct doorklikken naar de bestelpagina.',
								},
							},
						],
					},
				],
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'commissie',
		loadComponent: () =>
			import('./pages/commissie-page/commissie-page').then((module) => module.CommissiePage),
		title: 'Delirium | De Commissie',
		data: {
			seo: {
				description: 'Maak kennis met de commissie en subcommissies achter Delirium XIII.',
				schema: {
					'@context': 'https://schema.org',
					'@type': 'AboutPage',
					name: 'Delirium XIII Commissie',
					url: 'https://asoposlustrum.nl/commissie',
				},
			} satisfies SeoRouteData,
		},
	},
	{
		path: 'partners',
		loadComponent: () =>
			import('./pages/partners-page/partners-page').then((module) => module.PartnersPage),
		title: 'Delirium | Partners',
		data: {
			seo: {
				description: 'Bekijk alle partners en sponsoren van Delirium XIII.',
				schema: [
					{
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: 'Delirium XIII Partners',
						url: 'https://asoposlustrum.nl/partners',
					},
					{
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: [
							{
								'@type': 'Question',
								name: 'Hoe kan ik partner worden van Delirium XIII?',
								acceptedAnswer: {
									'@type': 'Answer',
									text: 'Gebruik de call-to-action op deze pagina om contact op te nemen via e-mail voor samenwerkingen.',
								},
							},
							{
								'@type': 'Question',
								name: 'Waar vind ik huidige sponsoren?',
								acceptedAnswer: {
									'@type': 'Answer',
									text: 'Op deze pagina staan zowel hoofdsponsoren als overige sponsoren met aanvullende informatie.',
								},
							},
						],
					},
				],
			} satisfies SeoRouteData,
		},
	},
	{
		path: '**',
		redirectTo: '',
	},
];
