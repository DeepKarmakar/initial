app.controller('AppCtrl', ['$scope', '$ionicSideMenuDelegate', '$firebaseAuth', '$location', 'commoProp', '$state', function($scope, $ionicSideMenuDelegate, $firebaseAuth, $location, commoProp, $state){

    $ionicSideMenuDelegate.canDragContent(false);

	// Check If user logged in
	$scope.username = commoProp.getUser();
	if ($scope.username) {
		$state.go('app.dashboard');
	}
	$scope.user = {};   //  K A L P I T    ---- Waste my 2days
	$scope.signIn = function(){ 
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();
		auth.$signInWithEmailAndPassword(username, password).then(function(){
			console.log('Success');
			$state.go('app.dashboard');
			commoProp.setUser($scope.user.email);
			$scope.errorMsg = false; 
		}).catch(function(error){
			$scope.errorMsg = true;
			$scope.errorMessage = error.message;
		});
	}

	$scope.logOut = function(){
		commoProp.logOutuser(); 
	};	 
	$scope.username = commoProp.getUser();
}]);


// Dashborad
app.controller('dashboardCtrl', ['$scope', '$firebaseArray', '$location', 'commoProp', '$mdDialog', '$ionicPopup', function($scope, $firebaseArray, $states, commoProp, $mdDialog, $ionicPopup){
	$scope.status = '  ';
  	$scope.customFullscreen = false;
	$scope.username = commoProp.getUser();

	// Check If user logged in
	if (!$scope.username) {
		$state.go('app.dashboard');
	}

	var ref = firebase.database().ref().child('Articles');
	$scope.articles = $firebaseArray(ref);

	$scope.article = {};
	$scope.createPost = function(){
		var title = $scope.article.titleTxt;
		var post = $scope.article.postTxt;

		$scope.articles.$add({
			title : title,
			post : post
		}).then(function(ref){
			console.log('Succ');
		}, function(error){
			console.log(error);
		});
	}; 


	$scope.editPost = function(id){
		var ref = firebase.database().ref().child('Articles/' + id);
		$scope.editPostData = $firebaseObject(ref);
	};

	$scope.updatePost = function(id){
		var ref = firebase.database().ref().child('Articles/' + id);
		ref.update({
			title : $scope.editPostData.title,
			post : $scope.editPostData.post
		}).then(function(ref){
			$('#editModal').modal('hide');
		}, function(error){
			console.log(error);
		});
	};

	$scope.deleteCnf = function(article){
		$scope.deleteArtivle = article;
	};

	$scope.deletePost = function(deleteArticle){
		$scope.articles.$remove(deleteArticle);
		$('#deleteModal').modal('hide');
	};

 
$scope.deleteConfirm = function(article) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirmPopup = $ionicPopup.confirm({
    	title: 'Delete Note',
    	template: 'Would you like to delete your note?', 
	    buttons: [
	      { text: 'Cancel' , type: 'button-stable' },
	      { text: 'Delete', type: 'button-assertive' , onTap: function(){return article;} }
	    ]
    });
    $scope.deleteArtivle = article; 
	confirmPopup.then(function(deleteArtivle) {
		if(deleteArtivle) {
		  $scope.articles.$remove(deleteArtivle);
		  console.log('deleted'); 
		  console.log($scope.articles); 
		}
	}); 
  };

}]); 

app.service('commoProp', ['$location', '$firebaseAuth', '$state', function($location, $firebaseAuth, $state){
	var user = "";
	var auth = $firebaseAuth();
	return {
		getUser : function(){
			if (user == "") {
				user = localStorage.getItem("userEmail");
			}
			return user;
		},
		setUser : function(value){
			localStorage.setItem("userEmail", value);
			user = value;
		},
		logOutuser: function(){
			auth.$signOut().then(function(){
				console.log("Logged Out");
				user = "";
				localStorage.removeItem('userEmail');
				$state.go('app.login');
			})
		}
	};
}]);

==================================================================================================
angular.module('starter.controllers', [])


.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('DashCtrl', ['$scope', '$firebaseArray', '$state', '$ionicPopup', 'postService', '$firebase', function($scope, $firebaseArray, $state, $ionicPopup, postService, $firebase){
  $scope.status = '  ';
  $scope.customFullscreen = false;

 
  // var ref = firebase.database().ref().child('Articles');
  // $scope.articles = $firebaseArray(ref);

  $scope.articles = postService.getPosts();

}])

.controller('DashSingleCtrl', ['$scope', 'postService', '$stateParams', '$firebase', function($scope, postService, $stateParams, $firebase){
  var postId = $stateParams.id;
  $scope.article = postService.getSinglePost(postId); 

  $scope.disableInp = false;
  $scope.editPost = function(){
      $scope.disableInp = true;
  }
 
  // $scope.updateMsg = false; 
  $scope.updatePost = function(postId){
    $scope.updateMsg = true;
    var refercene = firebase.database().ref().child('Articles/' + postId); 

    refercene.update({
      title : $scope.article.title,
      post : $scope.article.post
    }).then(function(refercene){
      $scope.updateMsg = false; 
      $scope.updatedMsg = "updated";
      console.log("done");
      console.log($scope);
    }, function(error){
      console.log(error);
    });
  };

}])


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("LoginController", function($scope, $firebaseAuth, $location) {
 
    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }
 
    $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    }
 
})

.factory('postService', function($firebaseArray, $firebaseObject){
 
  var ref = firebase.database().ref();
 
  return {
    getPosts: function(){ 
      return $firebaseArray(ref.child('Articles'));
    },
    getSinglePost: function(postId){
      return $firebaseObject(ref.child('Articles/' + postId));
    }
  }  
});	
