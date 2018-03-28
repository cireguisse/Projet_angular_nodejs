
 * Déclaration du module applicatif 'calculetteMiageApp' 
 * Contient l'ensemble des composants de l'application calculette
 */
angular.module("calculetteMiageApp", [])
        .service("OperationsHistoryService", [function () {
                this.history = [];
                this.currentOperation = {};

                this.computeOperation = function (operator) {
                    if (angular.isUndefined(operator)) {
                        console.warn("missing operator to compute operation");
                        return;
                    }
                    var op1 = parseFloat(this.currentOperation.op1);
                    var op2 = parseFloat(this.currentOperation.op2);
                    if (isNaN(op1) || isNaN(op2)) {
                        console.warn("wrong operands");
                        return;
                    }
                    var res;
                    switch (operator) {
                        case "+":
                            res = op1 + op2;
                            break;
                        case "-":
                            res = op1 - op2;
                            break;
                        case "/":
                            if (op2 === 0.) {
                                console.warn("cannot divide by 0");
                                return;
                            }
                            res = op1 / op2;
                            break;
                        case "*":
                            res = op1 * op2;
                            break;
                        default :
                            console.warn("Wrong operator " + operator);
                            return;
                    }
                    //Update currentOperation
                    this.currentOperation.op1 = op1;
                    this.currentOperation.op2 = op2;
                    this.currentOperation.operator = operator;
                    this.currentOperation.res = res;
                    //Sauvegarde une copie de l'operation dans l'historique
                    this.history.push(angular.copy(this.currentOperation));
                    //retourne le resultat
                    return res;
                };

                this.clearHistory = function () {
                    this.history.length = 0;
                };

                this.loadMemory = function (memory) {
                    this.currentOperation.op1 = memory;
                }

                //Charge une operation dans l'operation courante
                this.loadOperation = function (operation) {
                    this.currentOperation.op1 = operation.op1;
                    this.currentOperation.op2 = operation.op2;
                    this.currentOperation.operator = operation.operator;
                    this.currentOperation.res = operation.res;
                };
            }])
        .controller("CalculetteCtrl", ["$scope", "OperationsHistoryService", function ($scope, OHSvc) {
                //Initialisation des donnes : on fait un lien entre le scope et l'operation courante du service d'historique
                $scope.operation = OHSvc.currentOperation;

                //Fonction à appeler depuis le DOM pour le calcul de l'operation
                $scope.computeOperation = function (operator) {
                    OHSvc.computeOperation(operator);
                };
            }])
        .controller("MemoryCtrl", ["$scope", "OperationsHistoryService", function ($scope, OHSvc) {
                //Initialisation des donnees 
                $scope.data = {memory: null};

                //retourne vrai si il existe un resultat dans l'operation courante
                $scope.canSaveMemory = function () {
                    return angular.isDefined(OHSvc.currentOperation.res);
                };

                //Sauvegarde la memoire
                $scope.saveMemory = function () {
                    $scope.data.memory = OHSvc.currentOperation.res;
                };

                //Charge la mémoire
                $scope.loadMemory = function () {
                    OHSvc.currentOperation.op1 = $scope.data.memory;
                };
            }])
        .controller("HistoryCtrl", ["$scope", "OperationsHistoryService", function ($scope, OHSvc) {
                //Initialisation des donnees
                $scope.history = OHSvc.history;

                //Charge une operation de l'historique
                $scope.loadOperation = function (operation) {
                    OHSvc.loadOperation(operation);
                };
                
                //Efface l'historique
                $scope.resetHistory = function(){
                    OHSvc.clearHistory();
                };
            }]);
