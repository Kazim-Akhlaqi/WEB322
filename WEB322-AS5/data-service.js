const Sequelize = require('sequelize');
////////////////////////////////////////
var sequelize = new Sequelize('dd1anu1calvb6k', 'yuvtjzlqzcllts', 'a92b4670617fa03d8d7ab15556713dbe730ae8669cb83b4b7d274a43aa86d580', {
    host: 'ec2-54-235-156-60.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});
////////////////////////////////////////
const Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    martialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING,
});
////////////////////////////////////////
const Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});
////////////////////////////////////////
Department.hasMany(Employee, {
    foreignKey: 'department'
});
////////////////////////////////////////
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve("Database synced successfully ");
            })
            .catch(() => {
                reject("unable to sync the database");
            });
    });
};
////////////////////////////////////////
module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};
////////////////////////////////////////
module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
                where: {
                    status: status
                }
            })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            })
    });
};
////////////////////////////////////////
module.exports.getEmployeesByDepartment = function (dept) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
                where: {
                    department: dept
                }
            })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            })
    });
};
////////////////////////////////////////
module.exports.getEmployeesByManager = function (managerNum) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
                where: {
                    employeeManagerNum: managerNum
                }
            })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            })
    });
};
////////////////////////////////////////
module.exports.getEmployeeByNum = function (empNum) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
                where: {
                    employeeNum: empNum
                }
            })
            .then((data) => {
                resolve(data[0]);
            })
            .catch(() => {
                reject("no results returned");
            })
    });
};
////////////////////////////////////////
module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Department.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};
////////////////////////////////////////
module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") employeeData[prop] = null;
        };
        Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            })
            .then(() => {
                console.log("New employee created successfully");
                resolve(Employee[1]);
            })
            .catch(() => {
                reject("unable to create employee");
            });
    });
};
////////////////////////////////////////
module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") employeeData[prop] = null;
        };
        Employee.update({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                hireDate: employeeData.hireDate
            }, {
                where: {
                    employeeNum: employeeData.employeeNum
                }
            })
            .then(() => {
                console.log("Employee information updated successfully");
                resolve(Employee);
            })
            .catch(() => {
                reject("unable to update employee");
            });
    });
};
////////////////////////////////////////
module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") departmentData[prop] = null;
        };
        Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            })
            .then(() => {
                console.log("New department created successfully");
                resolve(Department[1]);
            })
            .catch(() => {
                reject("unable to create department");
            });
    });
};
////////////////////////////////////////
module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") departmentData[prop] = null;
        };
        Department.update({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            }, {
                where: {
                    departmentId: departmentData.departmentId
                }
            })
            .then(() => {
                console.log("Department updated successfully");
                resolve(Department);
            })
            .catch(() => {
                reject("unable to update department");
            });
    });
};
////////////////////////////////////////
module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
                where: {
                    departmentId: id
                }
            })
            .then((data) => {
                resolve(data[0]);
            })
            .catch(() => {
                reject("no results returned");
            })
    });
};
////////////////////////////////////////
module.exports.deleteDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.destroy({
                where: {
                    departmentId: id
                }
            })
            .then(() => {
                resolve("Department deleted.");
            })
            .catch(() => {
                reject("Unable to Delete Employee.");
            })
    })
};
////////////////////////////////////////
module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise(function (resolve, reject) {
        Employee.destroy({
                where: {
                    employeeNum: empNum
                }
            })
            .then(() => {
                resolve("Employee deleted.");
            })
            .catch(() => {
                reject("Unable to Delete Employee.");
            })
    })
};
////////////////////////////////////////
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            reject("no results returned");
        });
    });
}
