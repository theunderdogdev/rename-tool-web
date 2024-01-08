const renameApp = angular.module("renameApp", []);
renameApp.config([
  "$interpolateProvider",
  function ($interpolateProvider) {
    $interpolateProvider.startSymbol("!{");
    $interpolateProvider.endSymbol("}!");
  },
]);

renameApp.controller("viewController", function ($rootScope, $scope, $http) {
  console.log($scope);
  $scope.absPath = "~/";
  $scope.pathValid = undefined;
  $scope.checked = false;
  $scope.pathContents = [];
  $scope.orgContents = [];
  $scope.filter = "start";
  $scope.pattern = "";
  $scope.checkPath = function () {
    console.log("doint");
    $http.post("/api/checkpath", { path: $scope.absPath }).then((res) => {
      const { pathValid, contents } = res.data;
      console.log(res.data);
      $scope.checked = true;
      $scope.pathValid = pathValid;
      if (pathValid) {
        $scope.pathContents = contents;
        $scope.orgContents = [...contents];
        console.log($scope.orgContents);
      }
    });
  };

  $scope.applyPattern = () => {
    console.log($scope.filter);
    console.log($scope.orgContents);
    if ($scope.filter === "start") {
      $scope.pathContents = $scope.orgContents.filter((c) =>
        c.name.toLowerCase().startsWith($scope.pattern)
      );
    } else if ($scope.filter === "end") {
      $scope.pathContents = $scope.orgContents.filter((c) =>
        c.name.toLowerCase().endsWith($scope.pattern)
      );
    } else if ($scope.filter === "pattern") {
      const reg = new RegExp($scope.pattern);
      $scope.pathContents = $scope.orgContents.filter((c) =>
        reg.test(c.name.toLowerCase())
      );
    }
  };
});
