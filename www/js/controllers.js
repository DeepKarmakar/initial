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
app.controller('dashboardCtrl', ['$scope', '$firebaseArray', '$location', 'commoProp', '$mdDialog', function($scope, $firebaseArray, $states, commoProp, $mdDialog){
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
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your note?')
          .textContent('All content will gone')
          .ariaLabel('Lucky day')  
          // .targetEvent(article)
          .ok('Delete')
          .cancel('Cancel');

    $scope.deleteArtivle = article; 

    $mdDialog.show(confirm).then(function(deleteArtivle) {
      $scope.status = 'Deleted';
      $scope.articles.$remove(deleteArtivle);
      console.log('deleted'); 
      console.log($scope.articles);
    }, function() {
      $scope.status = 'Canceled';
      console.log('Canceled');
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
