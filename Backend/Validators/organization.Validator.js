const validateOrganization = (req, res, next) => {
  const { name, owner, members } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Organization name is required");
  } else if (name.trim().length < 2) {
    errors.push("Organization name must be at least 2 characters long");
  }

  if (owner && typeof owner !== "string") {
    errors.push("Owner must be a valid user id");
  }

  if (members !== undefined) {
    if (!Array.isArray(members)) {
      errors.push("Members must be an array");
    } else {
      for (let i = 0; i < members.length; i++) {
        if (typeof members[i] !== "string") {
          errors.push("Each member must be a valid user id");
          break;
        }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export { validateOrganization };
