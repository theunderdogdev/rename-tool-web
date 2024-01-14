const renameApp = angular.module("renameApp", []);
renameApp.config([
  "$interpolateProvider",
  function ($interpolateProvider) {
    $interpolateProvider.startSymbol("!{");
    $interpolateProvider.endSymbol("}!");
  },
]);

renameApp.controller("viewController", function ($rootScope, $scope, $http) {
  $scope.absPath = "~/";
  $scope.pathValid = undefined;
  $scope.checked = false;
  $scope.pathContents = [];
  $scope.orgContents = [];
  $scope.filter = "start";
  $scope.pattern = "";
  $scope.newNamePat = "";
  $scope.newNameType = "start";
  $scope.navOpen = true;
  $scope.selection = [];

  $scope.onNavCtrl = function () {
    $scope.navOpen = !$scope.navOpen;
  };

  $scope.isSelected = function (fileName) {
    return $scope.selection.includes(fileName);
  };

  $scope.onFileSelect = function (fileName) {
    if (!$scope.selection.includes(fileName)) {
      $scope.selection.push(fileName);
    } else {
      const $idx = $scope.selection.indexOf(fileName);
      if ($idx !== -1) {
        const spliced = $scope.selection.splice($idx, 1);
      }
    }
  };
  $scope.checkPath = function () {
    console.log("doint");
    $http.post("/api/checkpath", { path: $scope.absPath }).then((res) => {
      const { pathValid, contents } = res.data;
      $scope.checked = true;
      $scope.pathValid = pathValid;
      if (pathValid) {
        $scope.pathContents = contents;
        $scope.orgContents = [...contents];
      }
    });
  };

  $scope.applyPattern = () => {
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

// Very much important considerations
/**
 * Todo 1:
 * Allow adding and removing rule sets before selection
 * Todo 2:
 * Allow drag select like the most modern file browser do
 */

// Debounced input: https://schier.co/blog/wait-for-user-to-stop-typing-using-javascript
