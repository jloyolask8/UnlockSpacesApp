'use strict';

/* Controllers */
// faq controller
  app.controller('FAQAccordionCtrl', ['$scope', function($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'How much does it cost to list my space?',
        content: 'Listing your workspace is completely FREE. We only charge a 20% commission for each successful booking. No hidden fees or surprises!'
      },
      {
        title: 'What are the basic requirements to list a venue?',
        content: 'Dynamic group body - #2'
      }
      ,
      {
        title: 'How does UnlockSpaces promote safety?',
        content: 'Dynamic group body - #2'
      }
      ,
      {
        title: 'Who will be booking my space?',
        content: 'Dynamic group body - #2'
      }
      ,
      {
        title: 'What kinds of spaces are listed?',
        content: 'If you are an owner or manager of an equipped office space you are able to list your work and meeting spaces for short-term bookings. Accepted spaces include Meeting Rooms, Conference Rooms, Hot Desks, Dedicated Desks, Day Offices, and Private Offices.'
      },
      {
        title: 'How do I get paid?',
        content: 'When a client books your space UnlockSpaces will collect the payment upfront. You can then request to be paid out for the Venue Fees, plus any applicable taxes, via your preferred payout method'
      }
    ];

   

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }])