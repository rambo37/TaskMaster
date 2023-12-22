"use strict";
exports.__esModule = true;
exports.adequatePasswordComplexity = exports.isEmailValid = exports.getUserIdFromToken = exports.isSignedIn = void 0;
var jwt_decode_1 = require("jwt-decode");
var isSignedIn = function () {
    var token = localStorage.getItem("token");
    if (token) {
        var decodedToken = (0, jwt_decode_1.jwtDecode)(token);
        var currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime)
            return false;
        else
            return true;
    }
    return false;
};
exports.isSignedIn = isSignedIn;
var getUserIdFromToken = function () {
    var token = localStorage.getItem("token");
    if (token) {
        try {
            var decodedToken = (0, jwt_decode_1.jwtDecode)(token);
            return decodedToken.userId;
        }
        catch (error) {
            console.error("Invalid token");
            return null;
        }
    }
    return null;
};
exports.getUserIdFromToken = getUserIdFromToken;
var isEmailValid = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isEmailValid = isEmailValid;
// Eventually add checks against common/easily guessed passwords
var adequatePasswordComplexity = function (password) {
    // At least 8 characters
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }
    // At least one digit
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }
    // At least one special character
    if (!/[!@#$%^&*]/.test(password)) {
        return "Password must contain at least one special character.";
    }
    return "";
};
exports.adequatePasswordComplexity = adequatePasswordComplexity;
