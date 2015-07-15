'use strict';

/**
 * Config for the router
 */
angular.module('app')
        .run(
                ['$rootScope', '$state', '$stateParams',
                    function ($rootScope, $state, $stateParams) {
                        $rootScope.$state = $state;
                        $rootScope.$stateParams = $stateParams;
                        $rootScope.appStarted = new Date();
                    }
                ]
                )
        .config(
                ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
                    function ($stateProvider, $urlRouterProvider, JQ_CONFIG) {

                        $urlRouterProvider
                                .otherwise('/home');

                        $stateProvider
                                .state('app', {
                                    abstract: true,
                                    url: '/app',
                                    templateUrl: 'tpl/app.html'
                                })

                                .state('app.ui', {
                                    url: '/ui',
                                    template: '<div ui-view class="fade-in-up"></div>'
                                })

                                // home state
                                .state('home', {
                                    url: '/home',
                                    templateUrl: 'tpl/home/home_new.html',
                                    controller: 'HomeController',
                                    activePage: 'home',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
<<<<<<< HEAD
                                                return uiLoad.load([
                                                    'tpl/home/home-controller.js',
                                                    'tpl/home/infobox.js',
                                                    'tpl/home/home.js',
//                                                    'tpl/home/menu-position.js',
                                                    'tpl/home/menu.all.js'
                                                    ]);
=======
                                                return uiLoad.load(['tpl/home/home-controller.js', 'tpl/home/infobox.js', 'tpl/home/home.js'
                                                ]);
>>>>>>> jonathan_branch
                                            }]
                                    }
                                })

                                //booking page
                                .state('app.bookspace', {
                                    url: '/spaces/{spaceId:[0-9]{1,20}}/book/:dateSelected',
                                    templateUrl: 'tpl/spaces/book_space.html',
                                    controller: 'BookingController',
                                    controllerAs: 'bookingCtrl',
                                    data: {requiresLogin: true},
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['tpl/spaces/booking-controller.js']);
                                            }]
                                    }
                                })

                                // admin - venues page
                                .state('app.venues', {
                                    url: '/venues',
                                    template: '<div ui-view class="fade-in"></div>',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['tpl/venues/venues.js'
                                                            , 'tpl/venues/faq.js'
                                                ]);
                                            }]
                                    }
                                })
//                                .state('app.venues.list', {
//                                    url: '/list',
//                                    templateUrl: 'tpl/venues/list.html',
//                                    controller: 'VenuesListController',
//                                    controllerAs: 'venuesListCtrl',
//                                    data: {requiresLogin: true}
//                                })
                                .state('app.yourlistings', {
                                    url: '/yourlisting',
                                    templateUrl: 'tpl/yourlistings/list.html',
                                    controller: 'YourListingsController',
                                    data: {requiresLogin: true},
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['tpl/yourlistings/yourlistings.js',
<<<<<<< HEAD
                                                'tpl/venues/venues.js',
                                                'tpl/venues/faq.js',
                                                'tpl/reservations/booking-requests.js',
                                                'tpl/admin/mailtemplates.js']);
=======
                                                    'tpl/venues/venues.js',
                                                    'tpl/venues/faq.js',
                                                    'tpl/reservations/booking-requests.js']);
>>>>>>> jonathan_branch
                                            }]
                                    }
                                })

                                .state('app.venues.edit', {
                                    url: '/{venueId:[0-9]{1,20}}/edit',
                                    templateUrl: 'tpl/venues/edit.html',
                                    controller: 'VenueEditController',
                                    data: {requiresLogin: true}
                                })

                                .state('app.venues.create', {
                                    url: '/create',
                                    templateUrl: 'tpl/venues/create.html',
                                    controller: 'VenuesCreateController',
                                    controllerAs: 'venuesCreateCtrl',
                                    data: {requiresLogin: true}
                                })

                                .state('app.venues.preview', {
                                    url: '/{venueId:[0-9]{1,20}}/preview',
                                    templateUrl: 'tpl/venues/view.html',
                                    controller: 'VenueViewController',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load('tpl/venues/venue-view.js');
                                            }]
                                    }
                                })

                                .state('app.pages', {
                                    url: '/pages',
                                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                                })

                                .state('app.pages.venue', {
                                    url: '/venue/{venueId:[0-9]{1,20}}',
                                    templateUrl: 'tpl/venues/view.html',
                                    controller: 'VenueViewController',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load('tpl/venues/venue-view.js');
                                            }]
                                    }
                                })

                                .state('app.pages.space', {
                                    url: '/space/{spaceId:[0-9]{1,20}}',
                                    templateUrl: 'tpl/spaces/view.html',
                                    controller: 'SpaceViewController',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load('tpl/spaces/space-view.js');
                                            }]
                                    }
                                })


                                // form
                                .state('app.form', {
                                    url: '/form',
                                    template: '<div ui-view class="fade-in"></div>',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load('js/controllers/form.js');
                                            }]
                                    }
                                })

                                .state('app.form.wizard', {
                                    url: '/wizard',
                                    templateUrl: 'tpl/form_wizard.html'
                                })

                                .state('app.ui.search', {
                                    url: '/search/:venuesSearchText/:lat/:lon/:details/:venueid/:spaceid',
                                    templateUrl: 'tpl/search/search.html',
                                })

                                // mail
                                .state('app.mail', {
                                    abstract: true,
                                    url: '/mail',
                                    templateUrl: 'tpl/mail.html',
                                    // use resolve to load other dependences
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/app/mail/mail.js',
                                                    'js/app/mail/mail-service.js',
                                                    JQ_CONFIG.moment]);
                                            }]
                                    }
                                })
                                .state('app.mail.list', {
                                    url: '/inbox/{fold}',
                                    templateUrl: 'tpl/mail.list.html'
                                })
                                .state('app.mail.detail', {
                                    url: '/{mailId:[0-9]{1,4}}',
                                    templateUrl: 'tpl/mail.detail.html'
                                })
                                .state('app.mail.compose', {
                                    url: '/compose',
                                    templateUrl: 'tpl/mail.new.html'
                                })
                                .state('app.dashboard', {
                                    url: '/dashboard',
                                    templateUrl: 'tpl/dashboard/dashboard.html',
                                    controller: 'DashboardController',
                                    data: {requiresLogin: true},
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['tpl/dashboard/dashboard.js',
                                                    JQ_CONFIG.moment]);
                                            }]
                                    }
                                })
                                .state('app.dashboard-v1', {
                                    url: '/dashboard-v1',
                                    templateUrl: 'tpl/app_dashboard_v1.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['js/controllers/chart.js']);
                                            }]
                                    }
                                })
                                .state('app.dashboard-v2', {
                                    url: '/dashboard-v2',
                                    templateUrl: 'tpl/app_dashboard_v2.html',
                                    resolve: {
                                        deps: ['$ocLazyLoad',
                                            function ($ocLazyLoad) {
                                                return $ocLazyLoad.load(['js/controllers/chart.js']);
                                            }]
                                    }
                                })

                                .state('app.todo', {
                                    url: '/todo',
                                    templateUrl: 'tpl/apps_todo.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/app/todo/todo.js',
                                                    JQ_CONFIG.moment]);
                                            }]
                                    }
                                })
                                .state('app.todo.list', {
                                    url: '/{fold}'
                                })


                                // others
                                .state('lockme', {
                                    url: '/lockme',
                                    templateUrl: 'tpl/signin/page_lockme.html'
                                })

                                // pages
                                .state('app.page', {
                                    url: '/page',
                                    template: '<div ui-view class="fade-in-down"></div>'
                                })

                                .state('app.page.profile', {
                                    url: '/profile/{profileId}',
                                    templateUrl: 'tpl/user_profile/profile.html',
                                    controller: 'ProfileViewController',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['tpl/user_profile/profile.js']);
                                            }]
                                    },
                                    data: {requiresLogin: true}
                                })
                                
                                .state('app.page.profileView', {
                                    url: '/profile/{profileId}/view',
                                    templateUrl: 'tpl/user_profile/profileView.html',
                                    controller: 'ProfileViewController',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['tpl/user_profile/profile.js']);
                                            }]
                                    },
                                    data: {requiresLogin: true}
                                })

                                .state('access', {
                                    url: '/access',
                                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                                })
                                .state('access.signin', {
                                    url: '/signin',
                                    templateUrl: 'tpl/signin/signin.html',
                                    controller: 'LoginCtrl',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['tpl/signin/signin.js']);
                                            }]
                                    }
                                })
                                .state('access.signup', {
                                    url: '/signup',
                                    templateUrl: 'tpl/signin/signup.html',
                                    resolve: {
                                        deps: ['uiLoad',
                                            function (uiLoad) {
                                                return uiLoad.load(['js/app/signin/signup.js']);
                                            }]
                                    }
                                })
                                .state('access.forgotpwd', {
                                    url: '/forgotpwd',
                                    templateUrl: 'tpl/signin/forgotpwd.html'
                                })
                                .state('access.404', {
                                    url: '/404',
                                    templateUrl: 'tpl/page_404.html'
                                });

                    }
                ]
                );
