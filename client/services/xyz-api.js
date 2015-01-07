// xyz-api.js
angular.module('xyz')
  .factory('xyzAPI', function($http){
    var backendHost = "http://localhost:3000/";
    return{
      getCollections:function(){
        return $http.get(backendHost + 'collections');
      },
      createCollection:function(params){
        return $http.post(backendHost + 'collections', params);
      },
      editCollection:function(id, name){
        return $http.put(backendHost + 'collections/' + id, {name: name} );
      },
      deleteCollection:function(id){
        return $http.delete(backendHost + 'collections/' + id);
      }
    };
  })