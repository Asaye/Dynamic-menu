
var menuModule = angular.module("menuApp", []);

menuModule.directive('menu', ['$compile', function($compile) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
            var name = element.attr("list").split(","),
                list = scope[name[0]][name[1]], id = name[2],
                ul = angular.element('<ul class = "hidden"><ul>'), 
                li = angular.element('<li>'), span = angular.element('<span>'),
                caret = angular.element('<span>'), inner_li; 
            span.text(scope[name[0]][id]);
            ul.addClass('menu');
            if (element.hasClass("menu-up")) {
                caret.addClass('caret caret-up');
            } else {
                caret.addClass('caret caret-down');
            } 
			var getSubmenu = function(item, li) {
				var inner_ul = angular.element('<ul>'),
				    inner_span = angular.element('<span>');
				inner_ul.addClass('submenu hidden');
				inner_span.addClass('caret caret-right');                                
				angular.forEach(item, function(subitem) {
					 if (typeof subitem !== 'object') { 
						inner_li = angular.element('<li>');                    
						inner_li.addClass('submenu-item').text(subitem);
						inner_ul.append(inner_li);
					 } else {
						getSubmenu(subitem, inner_li);
					 }
				});         
				li.attr("submenu","").append(inner_ul).append(inner_span);
			};
            angular.forEach(list, function(item) {
                if (typeof item !== 'object') {
                    li = angular.element("<li>");                
                    li.addClass('menu-item').text(item);
                    if (element.hasClass("menu-up")) {
                        li.addClass('dir-up');
                    }                    
                    ul.append(li);
                } else {
					getSubmenu(item,li);          
                } 
            }); 
			
            $compile(ul)(scope);            
            element.addClass('menu-container').css("cursor", "pointer")
                   .append(span).append(caret).append(ul);

            element.on('click', function(e) {
                var ele;
                scope.$apply(function() {
                    var target = angular.element(e.target),
                        handleEvent = target.find(".submenu").length === 0 || 
                                      e.target.tagName === 'SPAN' || 
                                      e.target.tagName === 'DIV';
                    if (handleEvent) {
                        angular.forEach(element.find(".menu-item"), function(item) {
                            ele = angular.element(item);
							if (ele.text() === scope[name[0]][id]) {
								ele.addClass('hidden');
							} else {
							   ele.removeClass('hidden');
							}
                        });
						
						var anchor = angular.element(e.target).parent().parent();
						var text =  angular.element(e.target).text();
						while(anchor[0].tagName === "LI") {
							text = anchor.clone().children().remove().end().text() + " "+ text;
							anchor = anchor.parent().parent();
						}
						
						if (e.target.tagName === "LI") {
							scope[name[0]][id] = text;
							element.children().eq(0).text(scope[name[0]][id]);
							element.find(".submenu-item").removeClass('tick');
							var target = angular.element(e.target);
							if (target.hasClass("submenu-item")) {                        
								target.addClass('tick');
							}
						}
						element.find(".menu").toggleClass("hidden");
                    }
                });
            });
            element.on('mouseleave', function(e) {
                scope.$apply(function() {                    
                    element.find(".menu").addClass("hidden");
                });
            });
        }
    }
}]);

menuModule.directive('submenu', [function(){
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {  
            element.on('mouseover', function(e) {
                scope.$apply(function() {
                    element.children().removeClass("hidden");
                });
            });
            element.on('mouseleave', function(e) {
                scope.$apply(function() {
                    element.children().eq(0).addClass("hidden");
                });
            });
        }
    }
}]);

menuModule.controller('menuController', ['$scope', function ($scope) { 
        
    $scope.User = class {
	
		constructor() {
			this._user = {dbVendor: 'PostgreSQL',nRows: 100}
		}

        get vendors() {
            return ['Relational', ['MySQL', 'Oracle', ['8i', '9', '9i', '10g', '11g', '12g'], 'PostgreSQL'],
			        'Non-relational',['MongoDB','DocumentDB','Cassandra','HBase','Redis']];
        } 
		get rows() {
            return [10,50,100,200,500,1000];
        } 
        get dbVendor() {
            return this._user.dbVendor;
        }
		set dbVendor(val) {
            this._user.dbVendor = val;
        }
		get nRows() {
            return this._user.nRows;
        }
		set nRows(val) {
            this._user.nRows = val;
        }
	};
	$scope.user = new $scope.User();
}]);
//The controller 'menuController' can also be replaced by the following without loosing functionality
/*
menuModule.controller('menuController', ['$scope', function ($scope) { 
    $scope.user = { dbVendor: 'PostgreSQL', 
	                nRows:100, 
					vendors: ['Relational', ['MySQL', 'Oracle', ['8i', '9', '9i', '10g', '11g', '12g'], 'PostgreSQL'],
			                  'Non-relational',['MongoDB','DocumentDB','Cassandra','HBase','Redis']],
					rows: [10,50,100,200,500,1000] 
				}; 	
}]);
*/


