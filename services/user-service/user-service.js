import mongoose from 'mongoose';
import { UserManagementSchema } from '../../mongoose/model/user-management-schema';
const HttpStatus = require('http-status-codes');

export class UserManagementService {

    constructor() {
        this.UserManagement =  mongoose.model('user', UserManagementSchema);
    };
    
    emailExists(email) {

        return new Promise((resolve, reject) => {
            this.UserManagement.findOne({email}, (error, data) => {
                if(data && data != null){
                    return this.rejected(reject, "Email already taken", HttpStatus.CONFLICT);
                }
                if(error){
                    return this.rejected(reject, "Technical Error", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                resolve();
            });
        });

    };

    insert(data) {

        const userManagement = new this.UserManagement();
        userManagement.username = data.username;
        userManagement.password = data.password;

        return this.emailExists(userManagement.username).then(() => {
            return new Promise((resolve, reject) => {
                userManagement.save((err) => {
                    if (err) {
                        return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return this.resolved(resolve, { message: "Successfully Inserted" });
                });
            });
        });
    };

    login(data) {

        return new Promise((resolve, reject) => {
            this.UserManagement.findOne(data, (error, data) => {
                if(data && data != null){
                    return this.resolved(resolve, { id: data._id });
                }
                if (error) {
                    return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                this.rejected(reject, "Incorrect Login", HttpStatus.UNAUTHORIZED);
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