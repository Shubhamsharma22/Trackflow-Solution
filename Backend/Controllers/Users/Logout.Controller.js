import AsyncHandler from "../../Utils/AsyncHandler.Utils.js"

const LogoutController = AsyncHandler(async (_req, res) => {
  res.clearCookie("token", { httpOnly: true })
  res.status(200).json({ message: "User logged out successfully" })
})

export default LogoutController
