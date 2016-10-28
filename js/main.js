var mainApp = angular.module("mainApp", ["ngRoute"]);
var mainApp1 = angular.module("mainApp1", []);
var authorApp = angular.module("authorApp", ["ngRoute"]);

mainApp.config(function($routeProvider) {
    $routeProvider
            .when("/", {
        templateUrl : "http://localhost:8888/layout.html"
    });
});

authorApp.config(function($routeProvider) {
    $routeProvider
            .when("/", {
        templateUrl : "http://localhost:8888/authorFormLayout.html"
    });
});

mainApp.service("mainFactory",function($http,$q)
{
   
   this.bookAndAuthorList = [];
  
   uid = 0;    

        this.getList = function(searchContent,whatToSearch)
        {
            var deferred = $q.defer();
            console.log("getList called");

                $http.get('http://localhost:8888/getList/searchContent/'+searchContent+'/whatToSearch/'+whatToSearch)
                .success( function(response, status, headers, config) 
                {
                    console.log("success");
                    deferred.resolve(response);
                    
                })
                .error(function(errResp) 
                {
                    deferred.reject({ message: "Cant fetch data this time" });
                });
                console.log("deffered promise : "+deferred.promise);
                return deferred.promise;

        };

});


mainApp.controller("mainController",function($scope,$http,mainFactory){

    $scope.book = {};
    $scope.search = function(whatToSearch)
    {
      console.log("Search function called onchange"+$scope.searchContent);
 
     mainFactory.getList($scope.searchContent,whatToSearch)
     .then(function(data){
        console.log("Data fetched from promise : "+data);
        $scope.bookList = data;     
     },function(reason){
         console.log("Not getting data from server : "+reason);
     });
      console.log("Got Data : "+$scope.bookList);
 $scope.names = ["Emil", "Tobias", "Linus"];
    };
    
    $scope.assignAuthor = function(name,id)
    {
        
        $scope.book.author = name;
        $scope.book.authorId = id;
    };
    
    
});


mainApp.service("addBookService",function($http,$q)
{
   
   this.bookAndAuthorList = [];
  
   uid = 0;    

        this.getAuthorNames = function(searchContent)
        {
            var deferred = $q.defer();
            console.log("getList called");

                $http.get('http://localhost:8888/getList/searchContent/'+searchContent)
                .success( function(response, status, headers, config) 
                {
                    console.log("success");
                    deferred.resolve(response);
                    
                })
                .error(function(errResp) 
                {
                    deferred.reject({ message: "Cant fetch data this time" });
                });
                console.log("deffered promise : "+deferred.promise);
                return deferred.promise;

        };

});

mainApp.controller("addBookController",function($scope){
    $scope.names = ["Emil", "Tobias", "Linus"];
    
});

mainApp.controller("editBookController",function($scope){
    $scope.names = "abc";
   
   
});

authorApp.controller("editAuthorController",function($scope){
    
});

authorApp.controller("authorController",function($scope){
    console.log($scope.auhtor);
});

