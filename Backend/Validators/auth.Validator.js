import User from "../Models/User.Model.js";

const authvalidator = ({ Name, Organization, Email, password }) => {
    if (!Name || !Organization) throw new Error("Name and Organization are required");
    if (!Email) throw new Error("Enter Email");
    if (!password || password.length < 6) throw new Error("Password Not Valid");

    return true

}

export default authvalidator