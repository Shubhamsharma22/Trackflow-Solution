import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import User from "../../Models/User.Model.js";
import Organization from "../../Models/Organization.Model.js";
import bcrypt from "bcrypt";

const createMember = AsyncHandler(async (req, res) => {
    const { UserName, password, Email, Organization: organizationId } = req.body;

    if (!UserName || !password || !Email || !organizationId) {
        throw new ApiError(400, "Required are missing");
    }

    const organization = await Organization.findOne({
        _id: organizationId,
        Owner: req.user.id
    });

    if (!organization) throw new ApiError(404, "Organization not found");

    const hashedpassword = await bcrypt.hash(password, 10);

    const member = await User.create({
        UserName,
        Email,
        password: hashedpassword,
        role: "Member",
        Organization: organization._id
    });

    organization.Members.push(member._id);
    await organization.save();

    res.status(201).json({
        message: "Member Created Successfully",
        member: {
            _id: member._id,
            UserName: member.UserName,
            Email: member.Email,
            role: member.role,
            Organization: member.Organization
        }
    });
});

export default createMember;