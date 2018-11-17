var fs = require("fs");
var _ = require("underscore");
////////////////////////////////////////
var employees = [];
var departments = [];
////////////////////////////////////////
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {

        fs.readFile(__dirname + "/data/employees.json", "utf8", function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            employees = JSON.parse(data);

            fs.readFile(__dirname + "/data/departments.json", "utf8", function (err, data) {
                if (err) {
                    reject("unable to read file");
                    return;
                }
                departments = JSON.parse(data);

                resolve();
            });
        });
    });
}
////////////////////////////////////////
module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) {
            reject({
                message: err
            });
        } else {
            resolve(employees);
        }
    });
}
////////////////////////////////////////
module.exports.getManagers = function () {

    return new Promise((resolve, reject) => {
        var managers = _.where(employees, {
            isManager: true
        });

        if (managers.length == 0) {
            reject({
                message: err
            });
        } else {
            resolve(managers);
        }
    });
}
////////////////////////////////////////

module.exports.getDepartments = function ( ) {
    return new Promise((resolve, reject) => {
        resolve(departments);
    });
}

////////////////////////////////////////
module.exports.getEmployeesByStatus = function (status) {
    var employeeByStatus = [];
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                employeeByStatus.push(employees[i]);
            }
        }
        if (employeeByStatus.length == 0) {
            reject("no result returned");
        }
        resolve(employeeByStatus);
    });
}
////////////////////////////////////////
module.exports.getEmployeesByDepartment = function (department) {
    var employeeByDepartment = [];
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                employeeByDepartment.push(employees[i]);
            }
        }
        if (employeeByDepartment.length == 0) {
            reject("no result returned");
        }
        resolve(employeeByDepartment);
    });
}
////////////////////////////////////////
module.exports.getEmployeesByManager = function (manager) {
    var employeesByManeger = [];

    return new Promise(function (resolve, reject) {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                employeesByManeger.push(employees[i]);
            }
        }
        if (employeesByManeger.length == 0) {
            reject("no result returned");
        }
        resolve(employeesByManeger);
    });
}
/////////////////////////////////////
module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                resolve(employees[i]);
            }
        }
        reject("no result returned");
    });
}
////////////////////////////////////////
module.exports.addEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    return new Promise((resolve, reject) => {
        resolve(employees);
        if (employees.length == 0) {
            reject("unable to add new employee");
        }
    });
}
////////////////////////////////////////

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        try {
            employees.forEach((employee, i) => {
                if (employee.employeeNum == employeeData.employeeNum) {
                    employees[i] = employeeData;    
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
