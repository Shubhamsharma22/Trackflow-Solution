const validateLogin = (req, res, next) => {
    const { Email, password } = req.body;
    const errors = [];

    if (
        typeof Email !== "string" ||
        !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(Email)
    ) {
        errors.push("Enter Valid Email ID");
    }

    if (typeof password !== "string" || password.length < 6) {
        errors.push("Enter a Valid Password");
    }

    if (errors.length > 0) {
        return res.status(401).json({ errors });
    }

    next();
};

export { validateLogin };
