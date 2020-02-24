import mongoose from 'mongoose';
import { UserManagementSchema } from '../../mongoose/model/user-management-schema';
const HttpStatus = require('http-status-codes');

export class UserManagementService {

    constructor() {
        this.UserManagement =  mongoose.model('user', UserManagementSchema);
    };
    
    usernameExists(username) {

        return new Promise((resolve, reject) => {
            this.UserManagement.findOne({username}, (error, data) => {
                if(data && data != null){
                    return reject({ 
                        message: "Username already taken", 
                        code: HttpStatus.CONFLICT
                    });
                }
                if(error){
                    return reject({
                        message: "Technical Error", 
                        code: HttpStatus.INTERNAL_SERVER_ERROR
                    });
                }
                return resolve();
            });
        });

    };

    insert(data) {

        const userManagement = new this.UserManagement();
        userManagement.username = data.username;
        userManagement.password = data.password;

        return new Promise((resolve, reject) => {
            if(data && (data.username && data.username.length > 0) || (data.password && data.password.length > 0)) {
                return this.usernameExists(userManagement.username).then(() => {
                    userManagement.save((err, data) => {
                        if(data && data != null){
                            return this.resolved(resolve, { id: data._id });
                        }
                        if (err) {
                            return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    });
                }, (error) => {
                    return this.rejected(reject, error.message, error.code);
                });
            } else {
                return this.rejected(reject, "Invalid Username/Password Fields...", HttpStatus.UNAUTHORIZED);
            }
        });
    };

    login(data) {

        return new Promise((resolve, reject) => {
            if(data && (data.username && data.username.length > 0) || (data.password && data.password.length > 0)) {
                this.UserManagement.findOne(data, (error, data) => {
                    if(data && data != null){
                        return this.resolved(resolve, { id: data._id });
                    }
                    if (error) {
                        return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    this.rejected(reject, "Incorrect Login", HttpStatus.UNAUTHORIZED);
                });
            } else {
                this.rejected(reject, "Incorrect Login", HttpStatus.UNAUTHORIZED);
            }
        });

    };

    isUserIdValid(id) {
        return new Promise((resolve, reject) => {
            this.UserManagement.findById(id, (error, data) => {
                if(data){
                    resolve();
                } else {
                    reject({
                        message: "User Id Not Found",
                        code: HttpStatus.NOT_FOUND
                    });
                }
            });
        });
    };

    resolved(resolve, message) {
        resolve(message);
        return;
    };

    rejected(reject, message, statusCode) {
        reject({
            message: message,
            statusCode: statusCode
        });
        return;
    };
}